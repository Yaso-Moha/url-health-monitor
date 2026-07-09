const pool = require("../config/db");

const createWebsite = async (name, url) => {
    const result = await pool.query(
        `
        INSERT INTO websites (name, url)
        VALUES ($1, $2)
        RETURNING *
        `,
        [name, url]
    );

    return result.rows[0];
};

const getAllWebsites = async () => {
    const result = await pool.query(`
        SELECT
            w.id,
            w.name,
            w.url,
            w.created_at,

            uc.status,
            uc.status_code,
            uc.response_time AS "responseTime",
            uc.checked_at AS "lastChecked",

            COALESCE(stats.total_checks, 0)::int AS "checkCount",
            COALESCE(stats.up_checks, 0)::int AS "upCheckCount",
            CASE
                WHEN COALESCE(stats.total_checks, 0) = 0 THEN NULL
                ELSE ROUND((stats.up_checks::numeric / stats.total_checks) * 100)::int
            END AS "uptimePercentage"

        FROM websites w

        LEFT JOIN LATERAL (

            SELECT
                status,
                status_code,
                response_time,
                checked_at

            FROM url_checks

            WHERE website_id = w.id

            ORDER BY checked_at DESC

            LIMIT 1

        ) uc ON TRUE

        LEFT JOIN LATERAL (

            SELECT
                COUNT(*) AS total_checks,
                COUNT(*) FILTER (WHERE status = 'UP') AS up_checks

            FROM url_checks

            WHERE website_id = w.id

        ) stats ON TRUE

        ORDER BY w.id;
    `);

    return result.rows;
};

const getWebsiteById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            w.id,
            w.name,
            w.url,
            w.created_at,

            uc.status,
            uc.status_code,
            uc.response_time AS "responseTime",
            uc.checked_at AS "lastChecked",

            COALESCE(stats.total_checks, 0)::int AS "checkCount",
            COALESCE(stats.up_checks, 0)::int AS "upCheckCount",
            CASE
                WHEN COALESCE(stats.total_checks, 0) = 0 THEN NULL
                ELSE ROUND((stats.up_checks::numeric / stats.total_checks) * 100)::int
            END AS "uptimePercentage"

        FROM websites w

        LEFT JOIN LATERAL (

            SELECT
                status,
                status_code,
                response_time,
                checked_at

            FROM url_checks

            WHERE website_id = w.id

            ORDER BY checked_at DESC

            LIMIT 1

        ) uc ON TRUE

        LEFT JOIN LATERAL (

            SELECT
                COUNT(*) AS total_checks,
                COUNT(*) FILTER (WHERE status = 'UP') AS up_checks

            FROM url_checks

            WHERE website_id = w.id

        ) stats ON TRUE

        WHERE w.id = $1;
        `,
        [id]
    );

    return result.rows[0];
};

const deleteWebsiteById = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM websites
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    createWebsite,
    getAllWebsites,
    getWebsiteById,
    deleteWebsiteById,
};
