const transactionModel = require("../models/tansactionModel");

const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find({});
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getTransactions,
};
