const joi = require("joi");
const axios = require("axios");

const searchRestaurants = async (req, res) => {
  const validationRules = joi.object({
    city: joi.string().required(),
  });
  const validation = validationRules.validate(req.body);
  if (validation.error) return res.status(400).json(validation.error.details);

  try {
    const { city } = req.body;
    const response = await axios.get(
      `${process.env.MAPS_PLACE_ENDPOINT}?query=restaurants%20in%20${city}&key=${process.env.MAPS_API_KEY}`
    );
    return res.status(200).json(response.data.results);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  searchRestaurants,
};
