const express = require("express");
const router = express.Router();

const {
    getAllHistory,
    getWebsiteIncidents,
    getWebsiteHistory
} = require("../controllers/historyController");

router.get("/", getAllHistory);
router.get("/:id", getWebsiteHistory);
router.get("/:id/incidents", getWebsiteIncidents);

module.exports = router;
