const {
    createWebsite,
    deleteWebsiteById,
    getAllWebsites,
    getWebsiteById
} = require("../models/websiteModel");
const { createHistoryCheck } = require("../models/historyModel");
const { checkWebsite } = require("../services/healthService");

const addWebsite = async (req, res) => {
    try {
        const { name, url } = req.body;

        if (!name || !url) {
            return res.status(400).json({ error: "Website name and URL are required." });
        }

        const trimmedName = name.trim();
        const trimmedUrl = url.trim();

        if (!trimmedName || !trimmedUrl) {
            return res.status(400).json({ error: "Website name and URL are required." });
        }

        try {
            const parsedUrl = new URL(trimmedUrl);

            if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                return res.status(400).json({ error: "URL must start with http:// or https://." });
            }
        } catch {
            return res.status(400).json({ error: "Please enter a valid website URL." });
        }

        const website = await createWebsite(trimmedName, trimmedUrl);
        const checkResult = await checkWebsite(website.url);

        await createHistoryCheck(website.id, checkResult);

        const websiteWithStatus = await getWebsiteById(website.id);

        res.status(201).json(websiteWithStatus);
    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(409).json({ error: "This website URL is already being monitored." });
        }

        res.status(500).json({ error: err.message });
    }
};

const listWebsites = async (req, res) => {
    try {
        const websites = await getAllWebsites();
        res.json(websites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const getWebsite = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ error: "Invalid website ID." });
        }

        const website = await getWebsiteById(id);

        if (!website) {
            return res.status(404).json({ error: "Website not found." });
        }

        res.json(website);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const removeWebsite = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ error: "Invalid website ID." });
        }

        const deletedWebsite = await deleteWebsiteById(id);

        if (!deletedWebsite) {
            return res.status(404).json({ error: "Website not found." });
        }

        res.json({ message: "Website deleted successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addWebsite,
    getWebsite,
    listWebsites,
    removeWebsite
};
