/* eslint-disable */
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const headers = {
    Accept: "application/json",
    Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`,
  };

  try {
    const uri =
      "https://api.unsplash.com/photos/random?orientation=landscape&collections=404339,151521,1248080,388793,3150958";

    const response = await fetch(uri, {
      headers,
    });

    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    const picture = data.urls.full;

    return {
      statusCode: 200,
      body: JSON.stringify(picture),
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
