const mockToken = "";

const mockUserCredentials = {
  id: 1,
  username: "username",
  password: "password",
};

const mockLogin = {
  username: "villasants2",
  password: "123456",
};

const mockNewUser = [
  {
    name: "cristiano ronaldo",
    username: "cr7",
    password: "$2b$10$YEaOaI01BbS/dLzn3UchL.mLnEl6nEXW.f2UYKGdLYiSxvqnjuBia",
  },
  {
    name: "cristiano facundo",
    username: "facu04",
    password: "$2b$10$YEaOaI01BbS/dLzn3UchL.mLnEl6nEXW.f2UYKGdLYiSxvqnjuBia",
  },
];

const userMockPopulated = {
  username: "carlos",
  password: "$2b$10$dCqo02lYj1Qe6OcsxWnTeO1cqS4CfqODNWcwR8a0XKqTcUWvYS8g2",
  name: "carlos",
  image: "carlitos.jpg",
  id: "629889a09f71ae38a5ab9ec6",
};

const userMockPopulatedWithoutPassword = {
  username: "carlos",
  name: "carlos",
  image: "carlitos.jpg",
  id: "629889a09f71ae38a5ab9ec6",
};

module.exports = {
  mockToken,
  mockUserCredentials,
  mockNewUser,
  mockLogin,
  userMockPopulated,
  userMockPopulatedWithoutPassword,
};
