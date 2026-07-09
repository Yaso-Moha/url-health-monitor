const express = require("express");
const router = express.Router();

const {
    addWebsite,
    getWebsite,
    listWebsites,
    removeWebsite
} = require("../controllers/websiteController");

router.post("/", addWebsite);
router.get("/", listWebsites);
router.get("/:id", getWebsite);
router.delete("/:id", removeWebsite);

module.exports = router;
