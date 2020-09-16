const gulp = require("gulp");
const nodemon = require("gulp-nodemon");
const livereload = require("gulp-livereload");
const clearConsole = require("clear");

const script = "server.js";

const restartServer = () => gulp.src(script).pipe(livereload());

livereload.listen();

const serverRestart = () => {
  nodemon({
    script,
    ignore: ["build/*", "public/*"],
  }).on("restart", () => {
    clearConsole();
    restartServer();
  });
  return new Promise(function (resolve, reject) {
    resolve("Server ReStarted");
  });
};

gulp.task("default", gulp.parallel(serverRestart));
