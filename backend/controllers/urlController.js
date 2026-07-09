const { checkWebsite } = require("../services/healthService");

const checkUrl = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            message: "URL is required",
        });
    }

    const result = await checkWebsite(url);

    res.json({
        url,
        ...result,
    });
};

module.exports = {
    checkUrl,
};
