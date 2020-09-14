const app = require("./app");
const cleanup = require("./cleanup").cleanup();
const config = require("./.env");

process.send = process.send || function () {};

app.listen(config.server.port, () => {
  console.log(`API listening on port ${config.server.port}`);

  // Here we send the ready signal to PM2
  process.send("ready");
});
