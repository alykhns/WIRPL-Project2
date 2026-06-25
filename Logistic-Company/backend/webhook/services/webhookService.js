const axios = require("axios");
const WebhookSubscriber = require("../models/WebhookSubscriber");

async function notifyAll(resi, status) {
  const subscribers = await WebhookSubscriber.findAll();
  const payload = { resi, status, updatedAt: new Date().toISOString() };

  await Promise.all(
    subscribers.map((sub) =>
      axios.post(sub.callbackUrl, payload).catch((err) => {
        console.error(`Failed to notify ${sub.companyName}: ${err.message}`);
      })
    )
  );

  return payload;
}

module.exports = { notifyAll };
