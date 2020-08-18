const bcrypt = require("bcryptjs");
const chance = require("chance").Chance();
const { tables } = require("../../constants");

const counts = {
  // How many fixtures users we should generate
  users: 32,
  // How many fixtures messages range per one peer dialog we should generate
  messages: { min: 1, max: 64 },
};
const fixtureUUID = "00000000-0000-0000-0000-000000000000";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomInt = (max, min = 0) => min + Math.round(Math.random() * Math.round(max - min));

// Generate users
let users = [...Array(counts.users)].map(() => {
  const realname = chance.name({ middle: true });
  const username = realname.split(" ").join("").toLocaleLowerCase();
  const email = username + "@fixture.domain";
  return {
    username,
    realname,
    email,
    password: bcrypt.hashSync("qweqweqwe", 10),
    role: "user",
    confirmed: true,
    // this is for case on clean fixtures
    confirmation_code: fixtureUUID,
  };
});

exports.seed = async (knex) => {
  await knex(tables.admins).del();
  await knex(tables.members).del();
  await knex(tables.dialogs).del();
  await knex(tables.messages).del();
  await knex(tables.users).where({ confirmation_code: fixtureUUID }).del();

  // create users
  users = await knex(tables.users)
    .del()
    .then(() => knex(tables.users).insert(users).returning(["id", "username"]));

  const uids = users.map(({ id }) => id);
  let peers = [];
  const a = uids.pop();
  console.log(
    "Main user",
    users.find((_) => _.id === a)
  );
  uids.forEach((b, i) => {
    peers.push([a, b]);
  });

  // create peer dialogs
  for (const i in peers) {
    const dialog = await knex(tables.dialogs).insert({ last_message_id: null }).returning(["id"]);
    const dialog_id = dialog[0].id;
    // add dialog admins and members
    const dialogPeers = peers[i].map((user_id) => ({ user_id, dialog_id }));
    await knex(tables.admins).insert(dialogPeers);
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

    // Push messages
    // await Promise.all(
    //   messages.map(async (message) => {
    //     // We use fixture delay for some creation datetime offset
    //     await delay(10 * (Math.floor(Math.random() * 10) + 1));
    //     return await knex(tables.messages).insert(message);
    //   })
    // );
    // messages.forEach((message) => {
    for await (const message of messages) {
      // We use fixture delay for some creation datetime offset
      await delay(10 * (Math.floor(Math.random() * 10) + 1));
      await knex(tables.messages).insert(message);
    }
  }
  return knex(tables.users);
};
