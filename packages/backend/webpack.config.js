const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "node",
  entry: { main: "./src/main.ts" },
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
    path: path.resolve(__dirname, "build"),
  },
  /**
   * https://github.com/Automattic/mongoose/issues/7476#issuecomment-486912529
   */
  plugins: [new webpack.ContextReplacementPlugin(/.*/)],
};
