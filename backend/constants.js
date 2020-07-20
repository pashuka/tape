const lengths = {
  username: {
    min: 3,
    max: 34
  },
  email: {
    min: 3,
    max: 256
  },
  password: {
    min: 4,
    max: 64
  }
};

const coreUser = { id: 0, email: "core@email" };

const api = {
  v4: "v4"
};

const tables = {
  users: "users",
  dialogs: "dialogs",
  messages: "messages"
};

const resources = {
  auth: {
    signin: "auth/signin",
    signup: "auth/signup",
    signout: "auth/signout",
    status: "auth/status",
    reset: "auth/reset",
    verify: "auth/verify"
  },
  user: "user",
  dialogs: "dialogs",
  messages: "messages"
};

const roles = {
  anonymous: "anonymous",
  user: "user",
  admin: "admin"
};

const grants = {
  [roles.anonymous]: {
    home: { "read:any": ["*"] },
    auth: { "read:own": ["*"] }
  },
  [roles.user]: {
    home: { "read:any": ["*"] },
    auth: { "read:own": ["*"] },
    [resources.user]: { "read:any": ["*"], "update:own": ["*"], "delete:own": ["*"] },
    [resources.dialogs]: { "read:own": ["*"] },
    [resources.messages]: {
      "create:own": ["*"],
      "read:any": ["*"],
      "update:own": ["*"],
      "delete:own": ["*"]
    }
  },
  [roles.admin]: {
    home: { "read:any": ["*"] },
    auth: { "read:own": ["*"] },
    [resources.user]: { "read:any": ["*"], "update:own": ["*"], "delete:own": ["*"] },
    [resources.users]: {
      "create:any": ["*"],
      "read:any": ["*"],
      "update:any": ["*"],
      "delete:own": ["*"]
    },
    [resources.dialogs]: { "read:own": ["*"] },
    [resources.messages]: {
      "create:own": ["*"],
      "read:any": ["*"],
      "update:own": ["*"],
      "delete:own": ["*"]
    }
  }
};

module.exports = {
  coreUser,
  api,
  tables,
  resources,
  roles,
  grants,
  lengths
};
