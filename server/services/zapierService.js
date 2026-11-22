import dotenv from 'dotenv';
dotenv.config();

/**
 * Zapier Integration Service
 * 
 * Supports triggering Zapier webhooks and workflows using the user's
 * configured ZAPIER_API_KEY and ZAPIER_WEBHOOK_URL.
 */

export async function triggerZapierTravelWorkflow(payload) {
  const zapierApiKey = process.env.ZAPIER_API_KEY?.trim();
  const webhookUrl = process.env.ZAPIER_WEBHOOK_URL?.trim();

  // If no webhook URL is configured yet, record workflow status
  if (!webhookUrl) {
    return {
      triggered: false,
      message: 'Zapier Chatbot is active via interfaces.zapier.com embed. Optional ZAPIER_WEBHOOK_URL can be added to .env for outbound webhook automation.'
    };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(zapierApiKey ? { 'Authorization': `Bearer ${zapierApiKey}` } : {})
      },
      body: JSON.stringify({
        ...payload,
        source: 'TripTales Platform',
        timestamp: new Date().toISOString()
      })
    });

    if (!res.ok) {
      console.warn(`Zapier webhook returned HTTP ${res.status}`);
      return { triggered: false, status: res.status };
    }

    const data = await res.json().catch(() => ({}));
    return { triggered: true, data };
  } catch (err) {
    console.error('Zapier workflow dispatch error:', err.message);
    return { triggered: false, error: err.message };
  }
}
