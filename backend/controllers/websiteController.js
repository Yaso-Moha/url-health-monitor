const {
    createWebsite,
    deleteWebsiteById,
    getPublicWebsites,
    getAllWebsites,
    getWebsiteById,
    updateWebsiteSettings
} = require("../models/websiteModel");
const { runWebsiteCheck } = require("../services/monitorService");

const parseWebsiteId = (id) => {
    const parsedId = Number(id);

    return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
};

const normalizeUrl = (url) => {
    const trimmedUrl = url.trim();
    const parsedUrl = new URL(trimmedUrl.includes("://") ? trimmedUrl : `https://${trimmedUrl}`);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("URL must start with http:// or https://.");
    }

    return parsedUrl.toString();
};

const addWebsite = async (req, res) => {
    try {
        const {
            checkIntervalSeconds,
            isPublic,
            name,
            tag,
            url,
        } = req.body;

        if (!name || !url) {
            return res.status(400).json({ error: "Website name and URL are required." });
        }

        const trimmedName = name.trim();
        let normalizedUrl;

        if (!trimmedName || !url.trim()) {
            return res.status(400).json({ error: "Website name and URL are required." });
        }

        try {
            normalizedUrl = normalizeUrl(url);
        } catch {
            return res.status(400).json({ error: "Please enter a valid website URL." });
        }

        const interval = Number(checkIntervalSeconds) || 60;

        if (interval < 30 || interval > 3600) {
            return res.status(400).json({ error: "Check interval must be between 30 and 3600 seconds." });
        }

        const website = await createWebsite({
            checkIntervalSeconds: interval,
            isPublic: Boolean(isPublic),
            name: trimmedName,
            tag: tag?.trim() || "",
            url: normalizedUrl,
        });

        await runWebsiteCheck(website);
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
        const websites = await getAllWebsites({
            limit: req.query.limit,
            offset: req.query.offset,
            search: req.query.search,
            sortBy: req.query.sortBy,
            status: req.query.status,
        });

        res.json(websites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const getWebsite = async (req, res) => {
    try {
        const { id } = req.params;

        const websiteId = parseWebsiteId(id);

        if (!websiteId) {
            return res.status(400).json({ error: "Invalid website ID." });
        }

        const website = await getWebsiteById(websiteId);

        if (!website) {
            return res.status(404).json({ error: "Website not found." });
        }

        res.json(website);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const checkWebsiteNow = async (req, res) => {
    try {
        const websiteId = parseWebsiteId(req.params.id);

        if (!websiteId) {
            return res.status(400).json({ error: "Invalid website ID." });
        }

        const website = await getWebsiteById(websiteId);

        if (!website) {
            return res.status(404).json({ error: "Website not found." });
        }

        const result = await runWebsiteCheck(website);
        const websiteWithStatus = await getWebsiteById(website.id);

        res.json({
            check: result,
            website: websiteWithStatus,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const updateWebsite = async (req, res) => {
    try {
        const websiteId = parseWebsiteId(req.params.id);

        if (!websiteId) {
            return res.status(400).json({ error: "Invalid website ID." });
        }

        const updates = {};

        if (Object.prototype.hasOwnProperty.call(req.body, "tag")) {
            updates.tag = req.body.tag?.trim() || "";
        }

        if (Object.prototype.hasOwnProperty.call(req.body, "checkIntervalSeconds")) {
            const interval = Number(req.body.checkIntervalSeconds);

            if (!Number.isInteger(interval) || interval < 30 || interval > 3600) {
                return res.status(400).json({ error: "Check interval must be between 30 and 3600 seconds." });
            }

            updates.checkIntervalSeconds = interval;
        }

        if (Object.prototype.hasOwnProperty.call(req.body, "isPaused")) {
            updates.isPaused = Boolean(req.body.isPaused);
        }

        if (Object.prototype.hasOwnProperty.call(req.body, "isPublic")) {
            updates.isPublic = Boolean(req.body.isPublic);
        }

        const website = await updateWebsiteSettings(websiteId, updates);

        if (!website) {
            return res.status(404).json({ error: "Website not found." });
        }

        res.json(await getWebsiteById(websiteId));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const listPublicWebsites = async (req, res) => {
    try {
        const websites = await getPublicWebsites();
        res.json(websites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const removeWebsite = async (req, res) => {
    try {
        const { id } = req.params;

        const websiteId = parseWebsiteId(id);

        if (!websiteId) {
            return res.status(400).json({ error: "Invalid website ID." });
        }

        const deletedWebsite = await deleteWebsiteById(websiteId);

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
    checkWebsiteNow,
    getWebsite,
    listWebsites,
    listPublicWebsites,
    updateWebsite,
    removeWebsite
};
