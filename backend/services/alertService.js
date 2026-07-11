const axios = require("axios");

const sendWebhookAlert = async (payload) => {
    const webhookUrl = process.env.ALERT_WEBHOOK_URL;

    if (!webhookUrl) {
        return;
    }

    try {
        await axios.post(webhookUrl, payload, {
            timeout: 5000,
        });
    } catch (err) {
        console.error("Alert webhook failed:", err.message);
    }
};

const sendIncidentOpenedAlert = async (website, checkResult) => {
    await sendWebhookAlert({
        event: "incident.opened",
        message: `${website.name} is DOWN`,
        website: {
            id: website.id,
            name: website.name,
            url: website.url,
        },
        check: checkResult,
    });
};

const sendIncidentResolvedAlert = async (website, checkResult) => {
    await sendWebhookAlert({
        event: "incident.resolved",
        message: `${website.name} recovered`,
        website: {
            id: website.id,
            name: website.name,
            url: website.url,
        },
        check: checkResult,
    });
};

module.exports = {
    sendIncidentOpenedAlert,
    sendIncidentResolvedAlert,
};
