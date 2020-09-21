const path = require("path");

module.exports = {
  entry: "./src/scripts/index.js",
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(ico|svg|png|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "assets",
          },
        },
      },
    ],
  },
};
