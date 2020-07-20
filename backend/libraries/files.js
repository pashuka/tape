const fs = require("fs");
const config = require("../.env").formidable;

const getFiles = (dest = "", id = "") => {
  const p = `${process.cwd()}/${config.destination}/${dest}/${id}`;
  let files = [];
  if (fs.existsSync(p)) {
    files = fs.readdirSync(p);
  }
  return files;
};

module.exports = getFiles;
