const cron = require("node-cron");

const { getDueWebsites } = require("../models/websiteModel");
const { runWebsiteCheck } = require("./monitorService");

const startCron = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    console.log("Running scheduled checks...");

    try {
      const websites = await getDueWebsites();

      for (const website of websites) {
        try {
          const result = await runWebsiteCheck(website);

          console.log(
            `${website.name}: ${result.status} (${result.responseTime} ms)`
          );
        } catch (err) {
          console.error(`Error checking ${website.name}:`, err.message);
        }
      }
    } catch (err) {
      console.error("Cron Error:", err.message);
    }
  });
};

module.exports = startCron;
