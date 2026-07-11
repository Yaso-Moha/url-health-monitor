const { createHistoryCheck } = require("../models/historyModel");
const {
    createIncident,
    getOpenIncidentByWebsiteId,
    resolveIncident,
} = require("../models/incidentModel");
const { markWebsiteChecked } = require("../models/websiteModel");
const { checkWebsite } = require("./healthService");
const {
    sendIncidentOpenedAlert,
    sendIncidentResolvedAlert,
} = require("./alertService");

const runWebsiteCheck = async (website) => {
    const result = await checkWebsite(website.url);

    await createHistoryCheck(website.id, result);
    await markWebsiteChecked(website.id);

    const openIncident = await getOpenIncidentByWebsiteId(website.id);

    if (result.status === "DOWN" && !openIncident) {
        await createIncident(
            website.id,
            `HTTP ${result.statusCode || "unknown"} after ${result.responseTime} ms`
        );
        await sendIncidentOpenedAlert(website, result);
    }

    if (result.status === "UP" && openIncident) {
        await resolveIncident(openIncident.id);
        await sendIncidentResolvedAlert(website, result);
    }

    return result;
};

module.exports = {
    runWebsiteCheck,
};
