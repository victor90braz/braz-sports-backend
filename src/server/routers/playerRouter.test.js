const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectDB = require("../../database");
const app = require("../index");

const User = require("../../database/model/Player");
const { mockPlayers } = require("../../mocks/mockPlayers");

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

describe("Given a GET '/players' endpoint", () => {
  const newPlayerRequestReceived = {
    id: "1889",
    name: "Zidane",
    username: "Zizou",
    perfil: "France",
    date: "18/06/1990",
    nationality: "Frances",
    position: "Delantero",
    image:
      "https://phantom-elmundo.unidadeditorial.es/d1768bcbe2e6082856d1337df7a…",
    pac: "66",
    sho: "55",
    pass: "55",
    dri: "45",
    def: "88",
    phy: "99",
  };

  describe("When it receives a request", () => {
    test("Then it should receive the created user object", async () => {
      const { body } = await request(app)
        .get("/players")
        .send(newPlayerRequestReceived)
        .expect(200);

      expect(body.players).toBe(mockPlayers[newPlayerRequestReceived]);
    });
  });
});
