const transactionModel = require("../models/tansactionModel");

const saveTransaction = async (req, res, next) => {
  const transtaction = {
    endpoint: req.originalUrl,
    body: req.body || {},
  };

  try {
    await transactionModel.create(transtaction);
    next();
  } catch (error) {
    console.log("Transaction not saved");
    next();
  }
};

module.exports = {
  saveTransaction,
};
