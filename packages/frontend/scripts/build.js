const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
var rimraf = require("rimraf");

console.log("building react");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
process.env.INLINE_RUNTIME_CHUNK = false;
process.env.GENERATE_SOURCEMAP = false;

//react-scripts build
exec("yarn react-scripts build", (err, stdout, stderr) => {
  if (err) {
    console.error(err.message);
  }
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.error(stderr);
  }
  rimraf.sync(resolveApp("dist"), { recursive: true });
  fs.mkdirSync(resolveApp("dist"));
  fse.copySync(resolveApp("build"), resolveApp("dist"));
  //fse.moveSync(resolveApp("dist/index.html"), resolveApp("dist/popup.html"));
});
