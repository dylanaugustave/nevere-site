exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const data = JSON.parse(event.body);
  console.log(JSON.stringify({
    type: data.type,
    beat: data.beat,
    timestamp: new Date().toISOString(),
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};
