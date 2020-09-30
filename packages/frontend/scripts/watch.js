process.env.NODE_ENV = "development";

const fs = require("fs-extra");
const path = require("path");
const paths = require("react-scripts/config/paths");
const webpack = require("webpack");
const config = require("react-scripts/config/webpack.config.js")("development");

var entry = config.entry;
var plugins = config.plugins;

entry = entry.filter((fileName) => !fileName.match(/webpackHotDevClient/));
plugins = plugins.filter((plugin) => !(plugin instanceof webpack.HotModuleReplacementPlugin));

config.entry = entry;
config.plugins = plugins;

config.devtool = "inline-source-map";

webpack(config).watch({}, (err, stats) => {
  if (err) {
    console.error(err);
  } else {
    copyPublicFolder();
  }
  console.error(
    stats.toString({
      modules: false,
      chunks: false,
      colors: true,
    })
  );
});

function copyPublicFolder() {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
  fs.copySync(paths.appPublic, resolveApp("dist"), {
    dereference: true,
    filter: (file) => file !== paths.appHtml,
  });

  fs.copySync(resolveApp("dist"), resolveApp("../extension/dist"));
}
