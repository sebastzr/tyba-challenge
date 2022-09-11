const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const authModel = require("../models/authModel");
const userValidation = require("../models/userValidation");
const { registerUser, loginUser, logoutUser } = require("./userController");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../models/userValidation", () => {
  return {
    validate: jest.fn().mockReturnThis(),
  };
});
jest.mock("../models/userModel", () => {
  return {
    create: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
  };
});
jest.mock("../models/authModel", () => {
  return {
    create: jest.fn().mockReturnThis(),
  };
});

const res = {
  status: jest.fn(() => res),
  json: jest.fn(() => res),
};

const defaultRequest = {
  headers: {
    authorization: "ok",
  },
  body: {
    username: "sebas",
    password: "pass",
  },
};

const incorrectRequest = {
  body: {},
};

const validationError = {
  error: {
    details: "error",
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("registerUser", () => {
  it("should respond with status 400 if validation error", async () => {
    const validationSpy = jest
      .spyOn(userValidation, "validate")
      .mockReturnValue(validationError);
    const result = await registerUser(incorrectRequest, res);

    expect(validationSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledWith(incorrectRequest.body);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(validationError.error.details);
  });

  it("should respond with status 200 if user created", async () => {
    const validationSpy = jest
      .spyOn(userValidation, "validate")
      .mockReturnValue("ok");
    const createUserSpy = jest
      .spyOn(userModel, "create")
      .mockReturnValue("user");
    bcrypt.hash.mockImplementation(() => Promise.resolve("ok"));

    const result = await registerUser(defaultRequest, res);

    expect(validationSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledWith(defaultRequest.body);
    expect(createUserSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith({
      username: "sebas",
      password: "ok",
    });
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith("user");
  });

  it("should respond with status 500 if user create fails", async () => {
    const validationSpy = jest
      .spyOn(userValidation, "validate")
      .mockReturnValue("ok");
    const createUserSpy = jest
      .spyOn(userModel, "create")
      .mockImplementation(() => {
        throw "error";
      });
    const result = await registerUser(defaultRequest, res);

    expect(validationSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledWith(defaultRequest.body);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith("error");
  });
});

describe("loginUser", () => {
  it("should respond with status 400 if validation error", async () => {
    const validationSpy = jest
      .spyOn(userValidation, "validate")
      .mockReturnValue(validationError);
    const result = await loginUser(incorrectRequest, res);

    expect(validationSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledWith(incorrectRequest.body);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(validationError.error.details);
  });

  it("should respond with status 400 if user not found", async () => {
    const validationSpy = jest
      .spyOn(userValidation, "validate")
      .mockReturnValue("ok");
    const findOneUserSpy = jest
      .spyOn(userModel, "findOne")
      .mockReturnValue(null);

    const result = await loginUser(defaultRequest, res);

    expect(validationSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledWith(defaultRequest.body);
    expect(findOneUserSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should respond with status 200 if user exists and password match", async () => {
    const validationSpy = jest
      .spyOn(userValidation, "validate")
      .mockReturnValue("ok");
    const findOneUserSpy = jest
      .spyOn(userModel, "findOne")
      .mockReturnValue("user");
    bcrypt.compare.mockImplementation(() => Promise.resolve(true));
    jwt.sign.mockReturnValue("ok");

    const result = await loginUser(defaultRequest, res);

    expect(validationSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledWith(defaultRequest.body);
    expect(findOneUserSpy).toHaveBeenCalledTimes(1);
    expect(findOneUserSpy).toHaveBeenCalledWith({
      username: defaultRequest.body.username,
    });
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "ok",
      user: "user",
    });
  });

  it("should return status 400 if invalid credentials", async () => {
    const validationSpy = jest
      .spyOn(userValidation, "validate")
      .mockReturnValue("ok");
    const findOneUserSpy = jest
      .spyOn(userModel, "findOne")
      .mockReturnValue("user");
    bcrypt.compare.mockImplementation(() => Promise.resolve(false));

    const result = await loginUser(defaultRequest, res);

    expect(validationSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledWith(defaultRequest.body);
    expect(findOneUserSpy).toHaveBeenCalledTimes(1);
    expect(findOneUserSpy).toHaveBeenCalledWith({
      username: defaultRequest.body.username,
    });
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid Credentials",
    });
  });

  it("should respond with status 500 if user find fails", async () => {
    const validationSpy = jest
      .spyOn(userValidation, "validate")
      .mockReturnValue("ok");
    const findOneUserSpy = jest
      .spyOn(userModel, "findOne")
      .mockImplementation(() => {
        throw "error";
      });

    const result = await loginUser(defaultRequest, res);

    expect(validationSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledWith(defaultRequest.body);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith("error");
  });
});

describe("logout", () => {
  it("should return status 500 if create auth model fails", async () => {
    const createAuthSpy = jest
      .spyOn(authModel, "create")
      .mockImplementation(() => {
        throw "error";
      });
    const result = logoutUser(defaultRequest, res);

    expect(createAuthSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith("error");
  });

  it("should return status 200 if create a auth model", async () => {
    const createAuthSpy = jest.spyOn(authModel, "create").mockReturnValue("ok");

    const result = await logoutUser(defaultRequest, res);

    expect(createAuthSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith("See U");
  });
});
