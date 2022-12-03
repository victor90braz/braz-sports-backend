const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectDB = require("../../database");
const app = require("../index");

const { mockNewUser } = require("../../mocks/mocksUsers");

const User = require("../../database/model/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  User.create();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a POST '/register' endpoint", () => {
  const newUserRequestReceived = {
    name: "victor",
    username: "victor90braz",
    password: "victorbraz",
  };

  describe("When it receives a request", () => {
    test("Then it should receive the created user object", async () => {
      const { body } = await request(app)
        .post("/users/register")
        .send(newUserRequestReceived)
        .expect(201);

      expect(body.user).toBe(mockNewUser[newUserRequestReceived.name]);
    });
  });

  describe("When it receives a request with an existing user", () => {
    test("Then it should call the response method status code 409", async () => {
      await User.create(newUserRequestReceived);

      await request(app)
        .post("/users/register")
        .send(newUserRequestReceived)
        .expect(409);
    });
  });
});
