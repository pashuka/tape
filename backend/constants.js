const lengths = {
  username: {
    min: 3,
    max: 34,
  },
  email: {
    min: 3,
    max: 256,
  },
  password: {
    min: 4,
    max: 64,
  },
  message: {
    min: 1,
    max: 2 * 1024,
  },
};

const dialogTypes = ["direct", "group", "channel"];

const tapeEvents = {
  ["message-in-dialog"]: "message-in-dialog",
  ["user-info-changed"]: "user-info-changed",
  ["user-online"]: "user-online",
  ["user-offline"]: "user-offline",
  ["user-typing"]: "user-typing",
};

const coreUser = { id: 0, email: "core@email" };

const api = {
  v4: "v4",
};

const tables = {
  admins: "admins",
  dialogs: "dialogs",
  members: "members",
  messages: "messages",
  users: "users",
};

const resources = {
  admins: "admins",
  auth: {
    signin: "auth/signin",
    signup: "auth/signup",
    signout: "auth/signout",
    status: "auth/status",
    reset: "auth/reset",
    verify: "auth/verify",
  },
  dialogs: "dialogs",
  events: "events",
  members: "members",
  messages: "messages",
  user: "user",
};

const roles = {
  anonymous: "anonymous",
  user: "user",
  admin: "admin",
};

const grants = {
  [roles.anonymous]: {
    home: { "read:any": ["*"] },
    auth: { "read:any": ["*"] },
  },
  [roles.user]: {
    home: { "read:any": ["*"] },
    [resources.admin]: { "read:any": ["*"] },
    auth: { "read:own": ["*"] },
    [resources.user]: { "read:any": ["*"], "update:own": ["*"], "delete:own": ["*"] },
    [resources.dialogs]: { "read:any": ["*"] },
    [resources.members]: { "read:any": ["*"] },
    [resources.messages]: {
      "create:own": ["*"],
      "read:any": ["*"],
      "update:own": ["*"],
      "delete:own": ["*"],
    },
    [resources.events]: { "read:any": ["*"] },
  },
  [roles.admin]: {
    home: { "read:any": ["*"] },
    auth: { "read:own": ["*"] },
    [resources.user]: { "read:any": ["*"], "update:own": ["*"], "delete:own": ["*"] },
    [resources.users]: {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
      "delete:own": ["*"],
    },
    [resources.dialogs]: { "read:any": ["*"] },
    [resources.messages]: {
      "create:own": ["*"],
      "read:any": ["*"],
      "update:own": ["*"],
      "delete:own": ["*"],
    },
    [resources.events]: { "read:any": ["*"] },
  },
};

module.exports = {
  coreUser,
  api,
  tables,
  resources,
  roles,
  grants,
  lengths,
  dialogTypes,
  tapeEvents,
};
