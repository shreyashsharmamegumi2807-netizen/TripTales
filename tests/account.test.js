import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import express from 'express';
import { PgDialect } from 'drizzle-orm/pg-core';
import { createAccountRouter } from '../server/routes/account.js';
import { importBrowserRecords } from '../src/lib/account.ts';

async function serveRouter(context, options) {
  const app = express();
  app.use('/api/account', createAccountRouter(options));
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => new Promise(resolve => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}/api/account`;
}

test('rejects anonymous access and writes without the same-origin account header', async context => {
  const url = await serveRouter(context, { database: () => assert.fail('Anonymous requests must not reach the database') });
  const anonymous = await fetch(`${url}/trips`);
  assert.equal(anonymous.status, 401);
  assert.equal(anonymous.headers.get('cache-control'), 'private, no-store');

  const preflight = await fetch(`${url}/journal`, {
    method: 'OPTIONS',
    headers: { Origin: 'https://example.org', 'Access-Control-Request-Headers': 'x-triptales-account' },
  });
  assert.equal(preflight.status, 403);
  assert.equal(preflight.headers.get('access-control-allow-origin'), null);
});

test('binds reads, updates and deletes to the verified account, not a client-supplied owner', async context => {
  const dialect = new PgDialect();
  const filters = [];
  const inserts = [];
  const journal = { tripTitle: 'Weekend', destination: 'Jaipur', memories: 'A good walk', rating: 4, userId: 'other-account' };
  const database = {
    select: () => ({ from: () => ({ where: condition => {
      filters.push(dialect.sqlToQuery(condition));
      return { orderBy: async () => [] };
    } }) }),
    insert: () => ({ values: values => {
      inserts.push(values);
      const timestamp = new Date().toISOString();
      return { onConflictDoNothing: () => ({ returning: async () => [{ ...values, createdAt: timestamp, updatedAt: timestamp }] }) };
    } }),
    update: () => ({ set: ({ content }) => {
      assert.equal(Object.hasOwn(content, 'userId'), false);
      return { where: condition => {
        filters.push(dialect.sqlToQuery(condition));
        return { returning: async () => [] };
      } };
    } }),
    delete: () => ({ where: async condition => { filters.push(dialect.sqlToQuery(condition)); } }),
  };
  const url = await serveRouter(context, { authenticate: async () => 'verified-account', database: () => database });
  const headers = { 'X-TripTales-Account': 'verified-account', 'Content-Type': 'application/json' };

  assert.equal((await fetch(`${url}/trips`, { headers: { ...headers, 'X-TripTales-Account': 'other-account' } })).status, 409);
  assert.deepEqual(await (await fetch(`${url}/trips`, { headers })).json(), []);
  const create = await fetch(`${url}/journal`, { method: 'POST', headers, body: JSON.stringify({ content: journal }) });
  assert.equal(create.status, 201);
  assert.equal((await create.json()).userId, 'verified-account');
  assert.equal(inserts[0].userId, 'verified-account');
  assert.equal(Object.hasOwn(inserts[0].content, 'userId'), false);
  const update = await fetch(`${url}/journal/record-id`, { method: 'PUT', headers, body: JSON.stringify({ content: journal }) });
  assert.equal(update.status, 404);
  assert.equal((await fetch(`${url}/journal/record-id`, { method: 'DELETE', headers })).status, 204);
  assert.deepEqual(filters.map(filter => filter.params), [
    ['verified-account', 'trips'],
    ['verified-account', 'journal', 'record-id'],
    ['verified-account', 'journal', 'record-id'],
  ]);
  assert.ok(filters.every(filter => filter.sql.includes('"account_items"."user_id" =')));
});

test('imports only records matching the verified email and keeps records when a transfer fails', async context => {
  const records = new Map([
    ['triptales_users', JSON.stringify([
      { id: 'older-account', email: 'Traveler@example.com' },
      { id: 'other-account', email: 'other@example.com' },
    ])],
    ['triptales_saved_trips', JSON.stringify([
      { id: 'trip_owned', userId: 'older-account', title: 'Jaipur' },
      { id: 'trip_other', userId: 'other-account', title: 'Private trip' },
    ])],
    ['triptales_journal_entries', JSON.stringify([
      { id: 'jnl_owned', userId: 'older-account', tripTitle: 'Jaipur' },
    ])],
  ]);
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: key => records.get(key), setItem: (key, value) => records.set(key, value) },
  });
  context.after(() => {
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else delete globalThis.localStorage;
  });

  const fetchMock = context.mock.method(globalThis, 'fetch', async path => new Response(null, {
    status: path.endsWith('/journal') ? 503 : 204,
  }));
  const complete = await importBrowserRecords({ id: 'verified-account', email: 'traveler@example.com' }, () => true);

  assert.equal(complete, false);
  assert.deepEqual(fetchMock.mock.calls.map(call => JSON.parse(call.arguments[1].body).legacyId), ['trip_owned', 'jnl_owned']);
  assert.deepEqual(JSON.parse(records.get('triptales_saved_trips')).map(record => record.id), ['trip_other']);
  assert.deepEqual(JSON.parse(records.get('triptales_journal_entries')).map(record => record.id), ['jnl_owned']);
});
