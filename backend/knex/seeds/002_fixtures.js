const bcrypt = require("bcryptjs");
const chance = require("chance").Chance();
const { tables } = require("../../constants");

const counts = {
  // How many fixtures users we should generate
  users: 256,
  // How many fixtures messages for one peer dialog we should generate
  messages: { min: 5, max: 50 },
};
const fixtureUUID = "00000000-0000-0000-0000-000000000000";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomInt = (max, min = 0) => min + Math.round(Math.random() * Math.round(max - min));

// Generate users
const users = [...Array(counts.users)].map(() => {
  const realname = chance.name({ middle: true });
  const username = realname.split(" ").join("").toLocaleLowerCase();
  const email = username + "@fixture.domain";
  return {
    username,
    realname,
    email,
    password: bcrypt.hashSync("password", 10),
    role: "user",
    confirmed: true,
    // this is for case on clean fixtures
    confirmation_code: fixtureUUID,
  };
});

// Build peer dialogs
const usernames = users.map(({ username }) => username);
let peers = [];
const a = usernames.pop();
console.log("Main username", a);
usernames.forEach((b, i) => {
  peers.push([a, b]);
});
const peerDialogs = peers.map((group) => ({
  owners: JSON.stringify(group),
  participants: JSON.stringify(group),
}));

exports.seed = async (knex) => {
  await knex(tables.users).where({ confirmation_code: fixtureUUID }).del();
  await knex(tables.messages).del();
  await knex(tables.dialogs).del();

  // create users
  await knex(tables.users)
    .del()
    .then(() => knex(tables.users).insert(users));

  // create peer dialogs
  const dialogs = await knex(tables.dialogs)
    .insert(peerDialogs)
    .returning(["dialog_id", "participants"]);

  // Create messages with dialog's id
  let messages = [];
  dialogs.forEach(({ dialog_id, participants }) => {
    [...Array(randomInt(counts.messages.max, counts.messages.min))].forEach(() => {
      messages.push({
        dialog_id,
        body: chance.paragraph({ sentences: randomInt(1, 5) }),
        owner: participants[Math.floor(Math.random() * 2)],
      });
    });
  });

  // Push messages into database
  await Promise.all(
    messages.map(async (message) => {
      // We use fixture delay for some creation datetime offset
      await delay(100 * (Math.floor(Math.random() * 10) + 1));
      return knex(tables.messages).insert(message);
    })
  );

  return knex(tables.users);
};
