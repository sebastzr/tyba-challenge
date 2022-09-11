const axios = require("axios");
const { searchRestaurants } = require("./restaurantController");

jest.mock("axios");

const res = {
  status: jest.fn(() => res),
  json: jest.fn(() => res),
};

const defaultRequest = {
  body: {
    city: "Pereira",
  },
};

const incorrectRequest = {
  body: {},
};

describe("search restaurants", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fail if body.city does not exist", async () => {
    const result = await searchRestaurants(incorrectRequest, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it("should return results and status 200 if axios resolves", async () => {
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: { results: [] } })
    );

    const result = await searchRestaurants(defaultRequest, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([]);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it("should fail with status 500 if axios rejects", async () => {
    axios.get.mockImplementation(() => Promise.reject("error"));

    const result = await searchRestaurants(defaultRequest, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith("error");
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
