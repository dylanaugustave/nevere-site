const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const store = getStore("track-events");
  const data = JSON.parse(event.body);
  const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  await store.setJSON(key, {
    type: data.type,
    beat: data.beat,
    timestamp: new Date().toISOString(),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};
