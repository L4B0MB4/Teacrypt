const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: { injected: "./src/injected.ts", content: "./src/content.ts", background: "./src/background.ts" },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "./static", to: "." }],
    }),
  ],
};
