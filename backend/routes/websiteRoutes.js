const express = require("express");
const router = express.Router();

const {
    addWebsite,
    checkWebsiteNow,
    getWebsite,
    listWebsites,
    listPublicWebsites,
    updateWebsite,
    removeWebsite
} = require("../controllers/websiteController");

router.post("/", addWebsite);
router.get("/public/status", listPublicWebsites);
router.get("/", listWebsites);
router.get("/:id", getWebsite);
router.patch("/:id", updateWebsite);
router.post("/:id/check", checkWebsiteNow);
router.delete("/:id", removeWebsite);

module.exports = router;
