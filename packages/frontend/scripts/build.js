const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");

console.log("building react");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
process.env.INLINE_RUNTIME_CHUNK = false;
process.env.GENERATE_SOURCEMAP = false;

//react-scripts build
exec("yarn react-scripts build", (err) => {
  fs.rmdirSync(resolveApp("dist"), { recursive: true });
  fs.mkdirSync(resolveApp("dist"));
  fse.copySync(resolveApp("build"), resolveApp("dist"));
  fse.moveSync(resolveApp("dist/index.html"), resolveApp("dist/popup.html"));
});
