const cron = require("node-cron");

const pool = require("../config/db");
const { getAllWebsites } = require("../models/websiteModel");
const { checkWebsite } = require("./healthService");

const startCron = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    console.log("Running scheduled checks...");

    try {
      const websites = await getAllWebsites();

      for (const website of websites) {
        try {
          const result = await checkWebsite(website.url);

          // Save to database
               await pool.query(
                     `INSERT INTO url_checks
                     (website_id, status, status_code, response_time)
                     VALUES ($1, $2, $3, $4)`,
                    [
                      website.id,
                      result.status,
                      result.statusCode,
                      result.responseTime,
                    ]
                );

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