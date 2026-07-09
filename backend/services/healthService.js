const axios = require("axios");

const checkWebsite = async (url) => {
    const start = Date.now();

    try {
        const response = await axios.get(url, {
            timeout: 5000,
        });

        return {
            status: "UP",
            statusCode: response.status,
            responseTime: Date.now() - start,
        };
    } catch (error) {
        return {
            status: "DOWN",
            statusCode: error.response?.status || 500,
            responseTime: Date.now() - start,
        };
    }
};

module.exports = {
    checkWebsite,
};