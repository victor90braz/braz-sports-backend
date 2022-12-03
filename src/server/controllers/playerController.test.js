const Player = require("../../database/model/Player");
const { mockNewPlayer } = require("../../mocks/mockPlayers");
const { playerCredentials } = require("../../schemas/playerCredentials");
const {
  getPlayer,
  deletePlayer,
  createPlayer,
  editPlayer,
} = require("./playerControllers");

const listPlayers = [
  {
    id: "1990",
    name: "Ronaldo",
    username: "CR7",
    perfil: "Portugal",
    date: "18/06/1990",
    nationality: "Brasil",
    position: "Delantero",
    image:
      "https://phantom-elmundo.unidadeditorial.es/d1768bcbe2e6082856d1337df7a…",
    pac: "66",
    sho: "55",
    pass: "55",
    dri: "45",
    def: "88",
    phy: "99",
  },
  {
    id: "2",
    name: "Buffon",
    username: "bufon",
    perfil: "Italia",
    date: "18/06/1990",
    nationality: "Brasil",
    position: "Delantero",
    image:
      "https://phantom-elmundo.unidadeditorial.es/d1768bcbe2e6082856d1337df7a…",
    pac: "66",
    sho: "55",
    pass: "55",
    dri: "45",
    def: "88",
    phy: "99",
  },
  {
    id: "3",
    name: "Ricardo",
    username: "Kaka",
    perfil: "Brasil",
    date: "18/06/1990",
    nationality: "Brasil",
    position: "Delantero",
    image:
      "https://phantom-elmundo.unidadeditorial.es/d1768bcbe2e6082856d1337df7a…",
    pac: "66",
    sho: "55",
    pass: "55",
    dri: "45",
    def: "88",
    phy: "99",
  },
];

jest.mock("../../database/model/Player", () => ({
  ...jest.requireActual("../../database/model/Player"),
  find: jest.fn().mockResolvedValue(listPlayers),
  findById: jest.fn(),
}));

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given the GET players controller", () => {
  describe("When invoked with a response", () => {
    test("Then it should call the response status method 200", async () => {
      await getPlayer(null, res);

      const expectedStatus = 200;

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the response json method with a list of players", async () => {
      const expectedGames = listPlayers;

      await getPlayer(null, res);

      expect(res.json).toHaveBeenCalledWith(expectedGames);
    });
  });
});

describe("Given a deletePlayer controller", () => {
  describe("When it's invoqued with a response and a request with an id to delete", () => {
    test("Then it should call the response's status method with 200 and the json method with a 'Player deleted' message", async () => {
      const req = { params: { idPlayer: 1990 } };

      Player.findByIdAndDelete = jest.fn().mockResolvedValue();

      await deletePlayer(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "Player deleted" });
    });
  });

  describe("When it's invoqued with a response and a request with a invalid id to delete", () => {
    test("Then it should call the response's status method with 200 and the json method with a 'Player deleted' message", async () => {
      const next = jest.fn();
      const req = { params: { idPlayer: 1990 } };
      const expectedError = {
        message: "No player with that id found",
        code: 404,
      };

      Player.findByIdAndDelete = jest.fn().mockRejectedValue({});
      await deletePlayer(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a create funtion", () => {
  describe("When it`s invoked whith a response", () => {
    test("Then it should call the response method status with 201", async () => {
      const req = {
        body: {
          name: "Ronadlinho",
          image:
            "https://imagenes.20minutos.es/files/og_thumbnail/uploads/imagenes/2022/01/27/ronaldinho.jpeg",
          pac: 86,
          sho: 98,
          pass: 99,
          dri: 96,
          def: 95,
          phy: 96,
        },
      };

      const message = { msg: "Player created" };
      const expectedStatus = 201;

      Player.findOne = jest.fn().mockResolvedValue(false);
      Player.create = jest.fn().mockResolvedValue(message);

      await createPlayer(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(message);
    });
  });

  describe("When it's called with an existen username", () => {
    test("Then it should call response with error message 'User already exists'", async () => {
      const req = {
        body: mockNewPlayer,
      };

      const expectErrorMessage = new Error();
      expectErrorMessage.customMessage = "Player already exists";

      const next = jest.fn();
      Player.findOne = jest.fn().mockResolvedValue(playerCredentials);

      await createPlayer(req, null, next);

      expect(next).toHaveBeenCalledWith(expectErrorMessage);
    });
  });

  describe("When it's invoqued with a request with an invalid user and a response", () => {
    test("Then it should call the received next function with an error", async () => {
      const req = {
        body: {
          name: "",
          image: "",
          pac: "",
          sho: "",
          pass: "",
          dri: "",
          def: "",
          phy: "",
        },
      };
      const next = jest.fn();

      const expectedError = new Error();
      expectedError.code = 400;
      expectedError.message = "Bad request";

      Player.findOne = jest.fn().mockResolvedValue(false);
      Player.create = jest.fn().mockRejectedValueOnce(expectedError);

      await createPlayer(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a editPlayer controller", () => {
  const idPlayer = "1998";

  const req = {
    params: { idPlayer },
    body: {
      name: "Mbapé",
      image:
        "https://imagenes.20minutos.es/files/og_thumbnail/uploads/imagenes/2022/01/27/mbappe.jpeg",
      speed: 50,
      shoot: 99,
      pass: 99,
      agility: 99,
      defense: 90,
      strength: 90,
    },
  };
  describe("When it's invoqued with a title, content, category and a id of the Player to edit", () => {
    test("Then it should call the response's status method with 200 and the new object edited", async () => {
      const newPlayer = {
        name: "Mbapé 2022",
        image:
          "https://imagenes.20minutos.es/files/og_thumbnail/uploads/imagenes/2022/01/27/mbappe.jpeg",
        speed: 50,
        shoot: 99,
        pass: 99,
        agility: 99,
        defense: 90,
        strength: 90,
      };

      Player.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      Player.findById = jest.fn().mockResolvedValue(newPlayer);

      await editPlayer(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(newPlayer);
    });
  });

  describe("When it's invoqued with a response and a request with a invalid id to edit", () => {
    test("Then it should call the response's status method with 200 and the json method with a 'Player edited' message", async () => {
      const next = jest.fn();
      const expectedError = {
        statusCode: 400,
        customMessage: "Error editing player, check if it's exist",
      };

      Player.findByIdAndUpdate = jest.fn().mockRejectedValue({});
      await editPlayer(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
