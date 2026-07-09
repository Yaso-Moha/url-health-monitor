const {
  getHistory,
  getHistoryByWebsiteId,
} = require("../models/historyModel");

const getAllHistory = async (req, res) => {
  try {
    const history = await getHistory();
    res.json(history);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getWebsiteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "Invalid website ID." });
    }

    const history = await getHistoryByWebsiteId(id);
    res.json(history);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  getAllHistory,
  getWebsiteHistory,
};
