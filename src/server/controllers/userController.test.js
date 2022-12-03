const bcrypt = require("bcrypt");
const Player = require("../../database/model/Player");
const User = require("../../database/model/User");
const { mockPlayerById } = require("../../mocks/mockPlayers");

const {
  mockNewUser,
  mockToken,
  mockUserCredentials,
  mockLogin,
  userMockPopulated,
  userMockPopulatedWithoutPassword,
} = require("../../mocks/mocksUsers");
const { getPlayerID } = require("./playerControllers");
const { registerUser, loginUser, getUser } = require("./userControllers");

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockResolvedValue(() => true),
  hash: jest.fn().mockResolvedValue(() => "mockPasswordEncrypted"),
}));

jest.mock("jsonwebtoken", () => ({
  sign: () => mockToken,
}));

describe("Given a Register funtion", () => {
  describe("When it`s invoked whith a response", () => {
    test("Then it should call the response method status with 201", async () => {
      const req = {
        body: {
          username: "Buffon",
          password: "71",
          name: "Gian Luiggi Buffon",
        },
      };
      const message = { msg: "User created" };
      const expectedStatus = 201;

      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockResolvedValue(message);

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(message);
    });
  });

  describe("When it's called with an existen username", () => {
    test("Then it should call response with error message 'User already exists'", async () => {
      const req = {
        body: mockNewUser,
      };

      const expectErrorMessage = new Error();
      expectErrorMessage.customMessage = "User already exists";

      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(mockUserCredentials);

      await registerUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectErrorMessage);
    });
  });

  describe("When it's invoqued with a request with an invalid user and a response", () => {
    test("Then it should call the received next function with an error", async () => {
      const req = {
        body: {
          username: "",
          password: "",
          name: "",
        },
      };
      const next = jest.fn();

      const expectedError = new Error();
      expectedError.code = 400;
      expectedError.message = "Bad request";

      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockRejectedValueOnce(expectedError);

      await registerUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given userLogin function", () => {
  describe("When it's called with correct user credentials", () => {
    test("Then it should call response method status with 200 and method json with a token", async () => {
      const req = {
        body: {
          id: 1,
          username: "username",
          password: "password",
        },
      };

      const expectedStatus = 200;

      User.findOne = jest.fn().mockResolvedValue(true);

      await loginUser(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    });
  });

  describe("When it's called with incorrect username", () => {
    test("Then it should call next method with 'Incorrect username or password'", async () => {
      const req = {
        body: {
          name: "username",
          username: "passwordIncorrect",
        },
      };
      const next = jest.fn();
      const expectedError = new Error();
      expectedError.code = 401;
      expectedError.message = "Incorrect username or password";

      User.findOne = jest.fn().mockRejectedValueOnce(expectedError);

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it's called with incorrect password", () => {
    test("Then it should call next method with 'Incorrect username or password'", async () => {
      // Arrange
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const req = {
        body: {
          id: 1,
          username: "username",
          password: "incorrectPassword",
        },
      };

      const expectError = new Error();
      expectError.customMessage = "Incorrect username or password";

      const next = jest.fn();

      // Act
      await loginUser(req, null, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expectError);
    });
  });

  describe("When it is called with a user that is already in the database", () => {
    test("Then it should call the 'next' middleware with an error", async () => {
      const req = {
        body: {
          mockLogin,
        },
      };

      User.findOne.mockImplementation(() => true);

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const next = jest.fn();
      await loginUser(req, res, next);

      const error = new Error();
      error.statusCode = 403;
      error.customMessage = "bad request";

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getUser controller", () => {
  describe("When it's invoqued with a response and a request with the username to get", () => {
    test("Then it should call the response's status method with 200 and the json method with the user", async () => {
      const req = { params: { username: "Carlos" } };

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockReturnValue(userMockPopulated),
      }));

      await getUser(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: userMockPopulatedWithoutPassword,
      });
    });
  });

  describe("When it's invoqued with a next function and a request with a username that doesn't exist", () => {
    test("Then it should call the next function with am error", async () => {
      const req = { params: { surname: "Carlosn't" } };
      const next = jest.fn();
      const expectedError = {
        message: "No user with that username found",
        code: 404,
      };

      User.findOne = jest.fn(() => ({
        populate: jest.fn().mockRejectedValue({}),
      }));

      await getUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("Given a getPlayerID controller", () => {
    const req = {
      params: { player: "rivaldo" },
    };
    describe("When it's invoqued with a response and a id of a player to find", () => {
      test("Then it should call the response's status method with 200 and the json method with a note", async () => {
        Player.findById = jest.fn().mockResolvedValue(mockPlayerById[0]);

        await getPlayerID(req, res, null);

        expect(res.status).toHaveBeenCalledWith(200);
      });
    });

    describe("When it's invoqued with next function and an id of a note that doesn't exists", () => {
      test("Then it should call next with an 404 error and the message: 'Player not found'", async () => {
        const next = jest.fn();
        const err = { code: 404, message: "Player not found" };

        Player.findById = jest.fn().mockRejectedValue({});

        await getPlayerID(req, null, next);

        expect(next).toHaveBeenCalledWith(err);
      });
    });
  });
});
