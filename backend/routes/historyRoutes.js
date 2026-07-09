const express = require("express");
const router = express.Router();

const {
    getAllHistory,
    getWebsiteHistory
} = require("../controllers/historyController");

router.get("/", getAllHistory);
router.get("/:id", getWebsiteHistory);

module.exports = router;
