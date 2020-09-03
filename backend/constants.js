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
const memberRoles = ["member", "admin"];

const tapeEvents = {
  message_created: "message_created",
  message_changed: "message_changed",
  message_removed: "message_removed",
  dialog_changed: "dialog_changed",
  dialog_member_created: "dialog_member_created",
  dialog_member_changed: "dialog_member_changed",
  dialog_member_removed: "dialog_member_removed",
  user_info_changed: "user_info_changed",
  user_online: "user_online",
  user_offline: "user_offline",
  user_typing: "user_typing",
};

const coreUser = { id: 0, email: "core@email" };

const api = {
  v4: "v4",
};

const tables = {
  dialogs: "dialogs",
  members: "members",
  messages: "messages",
  users: "users",
};

const resources = {
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
    [resources.dialogs]: {
      "read:any": ["*"],
      "create:own": ["*"],
      "update:own": ["*"],
      "delete:own": ["*"],
    },
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
    [resources.dialogs]: {
      "read:any": ["*"],
      "create:own": ["*"],
      "update:own": ["*"],
      "delete:own": ["*"],
    },
    [resources.messages]: {
      "create:own": ["*"],
      "read:any": ["*"],
      "update:own": ["*"],
      "delete:own": ["*"],
    },
    [resources.events]: { "read:any": ["*"] },
  },
};

const supportMimes = ["image/gif", "image/jpeg", "image/png", "image/tiff", "image/webp"];

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
  supportMimes,
  memberRoles,
};
