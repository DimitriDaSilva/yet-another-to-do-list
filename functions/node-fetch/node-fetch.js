/* eslint-disable */
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const headers = {
    Accept: "application/json",
    Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`,
  };

  try {
    const { search } = event.queryStringParameters || {};
    if (!search) {
      return { statusCode: 400, body: "Search invalid" };
    }
    const uri = `https://api.unsplash.com/search/photos?orientation=landscape&query=${search}`;

    const response = await fetch(uri, {
      headers,
    });

    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    const picturesArr = [];
    const picturesObj = data.results;
    picturesObj.forEach((pic) => {
      const urls = pic.urls;
      picturesArr.push({ thumbnail: urls.thumb, large: urls.full });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(picturesArr),
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
