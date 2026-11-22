import { randomUUID } from 'node:crypto';
import express from 'express';
import { getIdentityConfig } from '@netlify/identity';
import { getContext } from '@netlify/server';
import { and, desc, eq } from 'drizzle-orm';
import { getDatabase } from '../../db/index.ts';
import { accountItems } from '../../db/schema.ts';

const collections = {
  trips: {
    required: ['title', 'destination', 'startingLocation', 'travellers', 'days', 'budget', 'tripType', 'itinerary'],
    optional: ['travelDate', 'preferences', 'budgetBreakdown'],
    legacyPrefix: 'trip_',
  },
  journal: {
    required: ['tripTitle', 'destination', 'memories', 'rating'],
    optional: ['travelDate', 'highlights', 'photoUrl'],
    legacyPrefix: 'jnl_',
  },
};

async function verifiedAccount(req) {
  const token = req.headers.cookie?.match(/(?:^|;\s*)nf_jwt=([^;]+)/)?.[1];
  if (!token) return null;

  const base = getIdentityConfig()?.url ?? new URL('/.netlify/identity', getContext().site.url).href;
  const response = await fetch(`${base.replace(/\/$/, '')}/user`, {
    headers: { Authorization: `Bearer ${token}` },
    redirect: 'error',
    signal: AbortSignal.timeout(5000),
  });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error('Identity verification unavailable');
  const user = await response.json();
  return typeof user.id === 'string' && user.id && user.confirmed_at ? user.id : null;
}

function itemContent(input, collection) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  if (!collection.required.every(field => Object.hasOwn(input, field))) return null;
  return Object.fromEntries([...collection.required, ...collection.optional]
    .filter(field => Object.hasOwn(input, field))
    .map(field => [field, input[field]]));
}

function toItem(row) {
  return {
    ...row.content,
    id: row.id,
    userId: row.userId,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

export function createAccountRouter({ authenticate = verifiedAccount, database = getDatabase } = {}) {
  const router = express.Router();
  router.use((req, res, next) => {
    res.set('Cache-Control', 'private, no-store');
    if (req.method !== 'GET' && req.method !== 'HEAD' && !req.get('x-triptales-account')) {
      return res.status(403).json({ error: 'This request must come from TripTales.' });
    }
    next();
  });
  router.use(async (req, res, next) => {
    try {
      const userId = await authenticate(req);
      if (!userId) return res.status(401).json({ error: 'Please sign in again to access your saved trips and journal.' });
      if (req.get('x-triptales-account') && req.get('x-triptales-account') !== userId) {
        return res.status(409).json({ error: 'Your account has changed. Please refresh and try again.' });
      }
      res.locals.userId = userId;
      next();
    } catch (error) {
      next(error);
    }
  });
  router.use(express.json({ limit: '512kb' }));
  router.param('kind', (req, res, next, kind) => {
    if (!Object.hasOwn(collections, kind)) return res.sendStatus(404);
    next();
  });

  function belongsToAccount(req, res) {
    return and(eq(accountItems.userId, res.locals.userId), eq(accountItems.kind, req.params.kind));
  }

  const handle = (action) => (req, res, next) => action(req, res).catch(next);

  router.get('/:kind', handle(async (req, res) => {
    const rows = await database().select().from(accountItems)
      .where(belongsToAccount(req, res)).orderBy(desc(accountItems.createdAt));
    res.json(rows.map(toItem));
  }));

  router.post('/:kind', handle(async (req, res) => {
    const collection = collections[req.params.kind];
    const content = itemContent(req.body?.content, collection);
    if (!content) return res.status(400).json({ error: 'Some required fields are missing.' });
    const legacyId = req.body.legacyId;
    if (legacyId !== undefined && (typeof legacyId !== 'string' || !legacyId.startsWith(collection.legacyPrefix)
      || !/^[a-z0-9_]{5,40}$/.test(legacyId))) {
      return res.status(400).json({ error: 'The older saved record was not recognized.' });
    }
    const date = legacyId && typeof req.body.createdAt === 'string' ? Date.parse(req.body.createdAt) : NaN;
    const [row] = await database().insert(accountItems).values({
      id: legacyId ?? randomUUID(),
      userId: res.locals.userId,
      kind: req.params.kind,
      content,
      ...(Number.isFinite(date) ? { createdAt: new Date(date).toISOString() } : {}),
    }).onConflictDoNothing().returning();
    if (!row) return res.sendStatus(204);
    res.status(201).json(toItem(row));
  }));

  router.put('/journal/:id', handle(async (req, res) => {
    const content = itemContent(req.body?.content, collections.journal);
    if (!content) return res.status(400).json({ error: 'Some required fields are missing.' });
    const [row] = await database().update(accountItems).set({ content, updatedAt: new Date().toISOString() })
      .where(and(eq(accountItems.userId, res.locals.userId), eq(accountItems.kind, 'journal'), eq(accountItems.id, req.params.id)))
      .returning();
    if (!row) return res.sendStatus(404);
    res.json(toItem(row));
  }));

  router.delete('/:kind/:id', handle(async (req, res) => {
    await database().delete(accountItems)
      .where(and(belongsToAccount(req, res), eq(accountItems.id, req.params.id)));
    res.sendStatus(204);
  }));

  router.use((error, _req, res, _next) => {
    if (error.status === 400 || error.status === 413) {
      return res.status(error.status).json({ error: 'The saved record is invalid or too large.' });
    }
    res.status(503).json({ error: 'TripTales could not reach your saved data. Please try again.' });
  });
  return router;
}
