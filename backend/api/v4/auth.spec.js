import request from "supertest";
import uuid from "uuid";

import app from "../../app";
import { api, resources, tables } from "../../constants";
import knex from "../../libraries/knex";
import { randomString } from "../../libraries/utils";

const fixtureUser1 = `fixture${randomString(8)}`;
const fixtureUser2 = `fixture${randomString(8)}`;

const fixture = {
  user1: {
    username: fixtureUser1,
    email: `${fixtureUser1}@user.email`,
    password: fixtureUser1,
  },
  user2: {
    username: fixtureUser2,
    email: `${fixtureUser2}@user.email`,
    password: fixtureUser2,
  },
};

afterAll(async () => {
  await knex(tables.users).del();
  knex.destroy();
});

describe(`SignUp`, () => {
  it("Try GET", async (done) => {
    await request(app.callback())
      .get(`/${api.v4}/${resources.auth.signup}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /text\/plain;/)
      .expect(404, "Not Found");
    done();
  });

  it("Without params", async (done) => {
    await request(app.callback())
      .post(`/${api.v4}/${resources.auth.signup}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json;/)
      .expect(400, {
        errors: [
          { field: "username", message: "Username field is required" },
          { field: "email", message: "Email field is required" },
          { field: "password", message: "Password field is required" },
        ],
      });
    done();
  });

  it("With user", async (done) => {
    await request(app.callback())
      .post(`/${api.v4}/${resources.auth.signup}`)
      .send(fixture.user1)
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json;/)
      .expect(200, { username: fixture.user1.username, realname: null, profile: null });
    done();
  });

  it("With same username", async (done) => {
    await request(app.callback())
      .post(`/${api.v4}/${resources.auth.signup}`)
      .send({ ...fixture.user1, username: fixture.user1.username })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json;/)
      .expect(400, {
        errors: [
          { field: "username", message: `Username ${fixture.user1.username} is not available` },
        ],
      });
    done();
  });

  it("With same email", async (done) => {
    await request(app.callback())
      .post(`/${api.v4}/${resources.auth.signup}`)
      .send({ ...fixture.user2, email: fixture.user1.email })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json;/)
      .expect(400, {
        errors: [{ field: "email", message: "Email is invalid or already taken" }],
      });
    done();
  });
});

//
describe(`SignIn`, () => {
  it("Try GET", async (done) => {
    await request(app.callback())
      .get(`/${api.v4}/${resources.auth.signin}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /text\/plain;/)
      .expect(404, "Not Found");
    done();
  });

  it("Without params", async (done) => {
    await request(app.callback())
      .post(`/${api.v4}/${resources.auth.signin}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json;/)
      .expect(400, {
        errors: [
          { field: "email", message: "Username or email field is required" },
          { field: "password", message: "Password field is required" },
        ],
      });
    done();
  });

  it("With undefined user", async (done) => {
    await request(app.callback())
      .post(`/${api.v4}/${resources.auth.signin}`)
      .send(fixture.user2)
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json;/)
      .expect(401, { errors: [{ message: "Invalid Credentials" }] });
    done();
  });

  it("With registered user", async (done) => {
    await request(app.callback())
      .post(`/${api.v4}/${resources.auth.signin}`)
      .send(fixture.user1)
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json;/)
      .expect(200, { username: fixture.user1.username, realname: null, profile: null });
    done();
  });
});

//
describe(`Forgot password`, () => {
  it("Without params", async (done) => {
    await request(app.callback())
      .put(`/${api.v4}/${resources.auth.reset}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, {
        errors: [{ field: "reset_code", message: "Reset code is required" }],
      });
    done();
  });

  it("With fake param", async (done) => {
    await request(app.callback())
      .put(`/${api.v4}/${resources.auth.reset}/?fake=${uuid.v4()}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, {
        errors: [{ field: "reset_code", message: "Reset code is required" }],
      });
    done();
  });

  it("With rand code and without passwds", async (done) => {
    await request(app.callback())
      .put(`/${api.v4}/${resources.auth.reset}/?code=${uuid.v4()}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, {
        errors: [
          { field: "password1", message: "New password field is required" },
          {
            field: "password2",
            message: "Confirm password field is required",
          },
        ],
      });
    done();
  });

  it("Invalid param code", async (done) => {
    await request(app.callback())
      .put(`/${api.v4}/${resources.auth.reset}/?code=INVALID-${uuid.v4()}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, {
        errors: [{ field: "reset_code", message: "Reset code is invalid" }],
      });
    done();
  });
});

//
describe(`Email verification code`, () => {
  it("Without params", async (done) => {
    await request(app.callback())
      .get(`/${api.v4}/${resources.auth.verify}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, {
        errors: [
          {
            field: "confirmation_code",
            message: "Confirmation code is required",
          },
        ],
      });
    done();
  });

  it("With fake param", async (done) => {
    await request(app.callback())
      .get(`/${api.v4}/${resources.auth.verify}/?fake=${uuid.v4()}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, {
        errors: [
          {
            field: "confirmation_code",
            message: "Confirmation code is required",
          },
        ],
      });
    done();
  });

  it("Valid random code", async (done) => {
    await request(app.callback())
      .get(`/${api.v4}/${resources.auth.verify}/?code=${uuid.v4()}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404, { errors: [{ message: "Verification code not found" }] });
    done();
  });

  it("Invalid param code", async (done) => {
    await request(app.callback())
      .get(`/${api.v4}/${resources.auth.verify}/?code=INVALID-${uuid.v4()}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, {
        errors: [
          {
            field: "confirmation_code",
            message: "Confirmation code is invalid",
          },
        ],
      });
    done();
  });
});
