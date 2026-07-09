const pool = require("../config/db");

const getHistory = async () => {
  const result = await pool.query(`
    SELECT *
    FROM url_checks
    ORDER BY checked_at DESC
  `);

  return result.rows;
};

const getHistoryByWebsiteId = async (websiteId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      website_id,
      status,
      status_code,
      response_time AS "responseTime",
      checked_at AS "checkedAt"
    FROM url_checks
    WHERE website_id = $1
    ORDER BY checked_at DESC
    `,
    [websiteId]
  );

  return result.rows;
};

const createHistoryCheck = async (websiteId, checkResult) => {
  const result = await pool.query(
    `
    INSERT INTO url_checks
    (website_id, status, status_code, response_time)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [
      websiteId,
      checkResult.status,
      checkResult.statusCode,
      checkResult.responseTime,
    ]
  );

  return result.rows[0];
};

module.exports = {
  createHistoryCheck,
  getHistory,
  getHistoryByWebsiteId,
};
