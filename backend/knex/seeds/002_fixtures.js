const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const chance = require("chance").Chance();
const { tables } = require("../../constants");
const { upload } = require("../../libraries/formidable");
const config = require("../../.env");

const counts = {
  // How many fixtures users we should generate
  users: 64,
  // How many fixture conversations to generate
  conversations: 48,
  // How many fixtures messages range per one peer dialog we should generate
  messages: { min: 1, max: 64 },
};
const fixtureUUID = "00000000-0000-0000-0000-000000000000";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomInt = (max, min = 0) => min + Math.round(Math.random() * Math.round(max - min));

const generateUser = ({ picture, gender = "male" }) => {
  const realname = chance.name({ middle: true, gender });
  const username = realname.split(" ").join("").toLocaleLowerCase();
  const email = username + "@fixture.domain";
  const profile = {};
  if (picture) profile.picture = picture;
  return {
    username,
    realname,
    email,
    password: bcrypt.hashSync("qweqweqwe", 10),
    role: "user",
    profile,
    confirmed: true,
    // this is for case on clean fixtures
    confirmation_code: fixtureUUID,
  };
};

// Generate users
// let users = [...Array(counts.users)].map(() => generateUser);

const unlinkFiles = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    fs.unlinkSync(path.join(dir, file));
  });
};

const uploadFiles = async (gender) => {
  const dir = path.join(__dirname, "avatars", gender);
  const files = fs.readdirSync(dir).map((_) => {
    const src = path.join(dir, _);
    const dst = path.join(config.formidable.destination, _);
    fs.copyFileSync(src, dst);
    return dst;
  });
  let pics = [];
  for await (const file of files) {
    pics.push(await upload({ path: file }, "user"));
  }
  return pics;
};

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

exports.seed = async (knex) => {
  unlinkFiles(`${process.cwd()}/${config.formidable.destination}/user`);

  await knex(tables.members).del();
  await knex(tables.dialogs).del();
  await knex(tables.messages).del();
  await knex(tables.users).where({ confirmation_code: fixtureUUID }).del();

  // create users
  const malePics = await uploadFiles("male");
  const males = malePics.map((picture) => generateUser({ picture, gender: "male" }));
  const femalePics = await uploadFiles("female");
  const females = femalePics.map((picture) => generateUser({ picture, gender: "female" }));
  const allUsers = await knex(tables.users)
    .del()
    .then(() =>
      knex(tables.users)
        .insert([...males, ...females])
        .returning(["id", "username"])
    );

  const uids = shuffle(allUsers)
    .map(({ id }) => id)
    .slice(0, counts.conversations);
  let peers = [];
  const a = uids.pop();
  console.log("Main user id", a);
  uids.forEach((b, i) => {
    peers.push([a, b]);
  });

  // create peer dialogs
  for (const i in peers) {
    const dialog = await knex(tables.dialogs).insert({ member_count: 2 }).returning(["id"]);
    const dialog_id = dialog[0].id;
    // add dialog admins and members
    const dialogPeers = peers[i].map((user_id) => ({
      user_id,
      dialog_id,
      dialog_type: "direct",
      role: "admin",
    }));
    await knex(tables.members).insert(dialogPeers);

    // Create messages with dialog's id
    const messages = [];
    [...Array(randomInt(counts.messages.max, counts.messages.min))].forEach(() => {
      messages.push({
        body: chance.paragraph({ sentences: randomInt(1, 5) }),
        dialog_id,
        owner_id: dialogPeers[Math.floor(Math.random() * 2)].user_id,
      });
    });

    // messages.forEach((message) => {
    for await (const message of messages) {
      // We use fixture delay for some creation datetime offset
      await delay(10 * (Math.floor(Math.random() * 10) + 1));
      await knex(tables.messages).insert(message);
    }
  }
  return knex(tables.users);
};
