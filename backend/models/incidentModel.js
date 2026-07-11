const pool = require("../config/db");

const getOpenIncidentByWebsiteId = async (websiteId) => {
    const result = await pool.query(
        `
        SELECT *
        FROM incidents
        WHERE website_id = $1
        AND status = 'OPEN'
        ORDER BY started_at DESC
        LIMIT 1
        `,
        [websiteId]
    );

    return result.rows[0];
};

const createIncident = async (websiteId, reason) => {
    const result = await pool.query(
        `
        INSERT INTO incidents (website_id, reason)
        VALUES ($1, $2)
        RETURNING *
        `,
        [websiteId, reason]
    );

    return result.rows[0];
};

const resolveIncident = async (incidentId) => {
    const result = await pool.query(
        `
        UPDATE incidents
        SET status = 'RESOLVED',
            resolved_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
        `,
        [incidentId]
    );

    return result.rows[0];
};

const getIncidentsByWebsiteId = async (websiteId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            website_id,
            started_at AS "startedAt",
            resolved_at AS "resolvedAt",
            status,
            reason,
            CASE
                WHEN resolved_at IS NULL THEN
                    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at))::int
                ELSE
                    EXTRACT(EPOCH FROM (resolved_at - started_at))::int
            END AS "durationSeconds"
        FROM incidents
        WHERE website_id = $1
        ORDER BY started_at DESC
        `,
        [websiteId]
    );

    return result.rows;
};

module.exports = {
    createIncident,
    getIncidentsByWebsiteId,
    getOpenIncidentByWebsiteId,
    resolveIncident,
};
