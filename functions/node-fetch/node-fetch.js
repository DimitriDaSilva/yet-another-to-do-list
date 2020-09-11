const fetch = require("node-fetch");

const apiKey = process.env.UNSPLASH_API_KEY;

exports.handler = async function (event, context) {
  try {
    const { search } = event.queryStringParameters || {};
    if (!search) {
      return { statusCode: 400, body: "Search invalid" };
    }
    const url =
      "https://api.unsplash.com/search/photos?orientation=landscape&query=" +
      search;

    const response = await fetch(`${url}&client_id=${apiKey}`);
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON(stringify(data)),
    };
  } catch {
    console.log("invocation error:", err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
