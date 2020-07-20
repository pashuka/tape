const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const Model = require("../models/user");
const { columnsToAuth } = require("../models/user");

const options = {
  usernameField: "email",
  passwordField: "password",
  session: true,
};

passport.serializeUser(({ username }, done) => {
  done(null, { username });
});

passport.deserializeUser(({ username }, done) => {
  if (!username) {
    // req.session.destroy(() => {});
    // return done(new Error("id is undefined"), null);
    return done(null, null);
  }
  return Model.findOne({ username })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    })
    .catch((e) => done(e, null));
});

passport.use(
  new LocalStrategy(options, (email, password, done) => {
    if (!email || !password) return done(null, false);
    return Model.findOne(
      { [email.indexOf("@") !== -1 ? "email" : "username"]: email },
      columnsToAuth
    )
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        bcrypt.compare(password, user.password, function (err, same) {
          if (same) {
            return done(null, {
              username: user.username,
              realname: user.realname,
              email: user.email,
              profile: user.profile,
              role: user.role,
            });
          } else {
            return done(null, false);
          }
        });
      })
      .catch((e) => {
        return done(e);
      });
  })
);
