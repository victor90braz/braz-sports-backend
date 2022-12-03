const { verify } = require("jsonwebtoken");
const auth = require("./auth");

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: jest.fn(),
}));

describe("Given the auth middleware function", () => {
  describe("When it receives a request with a valid token and next", () => {
    test("Then it should call next function", () => {
      verify.mockImplementation(() => ({ id: 3 }));
      const req = {
        headers: {
          authorization: "Bearer aSDFASDF",
        },
      };
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(req).toHaveProperty("userId", 3);
    });
  });

  describe("When it receives a request with an invalid authorization (no Bearer) and next function", () => {
    test("Then it should call next with an error 'Invalid token'", () => {
      const req = {
        headers: {
          authorization: "aSDFASDF",
        },
      };
      const customError = new Error("Invalid token");
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
