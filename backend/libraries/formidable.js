const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const sharp = require("sharp");

const config = require("../.env").formidable;

exports.get = (dest = "", id = "") => {
  const p = `${process.cwd()}/${config.destination}/${dest}/${id}`;
  let files = [];
  if (fs.existsSync(p)) {
    files = fs.readdirSync(p);
  }
  return files;
};

exports.has = files => {
  if (
    typeof files === "object" &&
    Object.entries(files).length > 0 &&
    Object.keys(files).find(_ => config.docs.includes(_))
  ) {
    return true;
  }
  return false;
};

exports.push = (files, id = 0, path) => {
  if (files) {
    for (var _ in files) {
      const fname = path.basename(files[_].path);
      const oPath = `${process.cwd()}/${config.destination}`;
      const nPath = `${process.cwd()}/${config.destination}/${_}/${id}`;
      if (!fs.existsSync(nPath)) {
        fs.mkdirSync(nPath, { recursive: true });
      }
      const ext = path.extname(fname).toLowerCase();
      fs.rename(`${oPath}/${fname}`, `${nPath}/${uuid.v4()}${ext}`, err => {
        if (err) throw new BadRequest([{ file: err }]);
      });
    }
  }
};

exports.upload = async function(file, resource = "") {
  return new Promise(function(resolve, reject) {
    const fname = path.basename(file.path);
    const oPath = `${process.cwd()}/${config.destination}`;
    const nPath = `${process.cwd()}/${config.destination}/${resource}`;
    if (!fs.existsSync(nPath)) {
      fs.mkdirSync(nPath, { recursive: true });
    }

    const uploadedFileName = `${oPath}/${fname}`;
    const uid = `${uuid.v4()}.jpg`;
    const resizedFileName = `${nPath}/${uid}`;
    const thumbFileName = `${nPath}/${config.thumb.prefix}${uid}`;

    // resize & crop
    try {
      sharp(uploadedFileName)
        .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0.5 } })
        .resize(400, 400, {
          fit: sharp.fit.cover,
          background: { r: 255, g: 255, b: 255, alpha: 0.5 }
          // Do not enlarge if the width or height are already less than the
          // specified dimensions, equivalent to GraphicsMagick's > geometry
          // option.
          // withoutEnlargement: true,
        })
        .toFormat("jpeg")
        .toFile(resizedFileName)
        .then(() => {
          // generate thumbs 64x64
          sharp(resizedFileName)
            .resize(config.thumb.size, config.thumb.size, {
              fit: sharp.fit.inside,
              background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            })
            .toFile(thumbFileName)
            .then(() => {
              fs.unlinkSync(uploadedFileName);
              resolve(uid);
            });
        });
    } catch (error) {
      reject(error);
    }
  });
};
