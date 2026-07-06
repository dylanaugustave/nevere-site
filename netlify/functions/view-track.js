const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const key = event.queryStringParameters && event.queryStringParameters.key;

  if (key !== process.env.VIEW_TRACK_SECRET) {
    return { statusCode: 403, body: "Forbidden" };
  }

  const store = getStore("track-events");
  const { blobs } = await store.list();
  const records = await Promise.all(
    blobs.map(async (b) => JSON.parse(await store.get(b.key)))
  );
  records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(records, null, 2),
  };
};
