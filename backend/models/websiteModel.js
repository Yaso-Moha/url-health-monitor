const pool = require("../config/db");

const normalizeWebsiteRow = (row) => {
    if (!row) {
        return row;
    }

    return {
        ...row,
        tag: row.tag || "",
    };
};

const createWebsite = async ({
    checkIntervalSeconds = 60,
    isPublic = false,
    name,
    tag = "",
    url,
}) => {
    const result = await pool.query(
        `
        INSERT INTO websites (name, url, tag, check_interval_seconds, is_public)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [name, url, tag, checkIntervalSeconds, isPublic]
    );

    return normalizeWebsiteRow(result.rows[0]);
};

const getAllWebsites = async ({
    limit,
    offset,
    search,
    sortBy = "newest",
    status,
} = {}) => {
    const conditions = [];
    const values = [];

    if (status && status !== "ALL") {
        values.push(status);
        conditions.push(`COALESCE(uc.status, 'UNKNOWN') = $${values.length}`);
    }

    if (search) {
        values.push(`%${search}%`);
        conditions.push(`(w.name ILIKE $${values.length} OR w.url ILIKE $${values.length})`);
    }

    const orderByMap = {
        alphabetical: "w.name ASC",
        fastest: "uc.response_time ASC NULLS LAST",
        newest: "w.created_at DESC",
        oldest: "w.created_at ASC",
        slowest: "uc.response_time DESC NULLS LAST",
    };
    const orderBy = orderByMap[sortBy] || orderByMap.newest;
    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const limitClause = Number.isInteger(Number(limit)) ? `LIMIT ${Number(limit)}` : "";
    const offsetClause = Number.isInteger(Number(offset)) ? `OFFSET ${Number(offset)}` : "";

    const result = await pool.query(
        `
        SELECT
            w.id,
            w.name,
            w.url,
            w.tag,
            w.check_interval_seconds AS "checkIntervalSeconds",
            w.is_paused AS "isPaused",
            w.is_public AS "isPublic",
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
            END AS "uptimePercentage",

            open_incident.id AS "openIncidentId",
            open_incident.started_at AS "incidentStartedAt"

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

        LEFT JOIN LATERAL (

            SELECT id, started_at

            FROM incidents

            WHERE website_id = w.id
            AND status = 'OPEN'

            ORDER BY started_at DESC

            LIMIT 1

        ) open_incident ON TRUE

        ${whereClause}

        ORDER BY ${orderBy}
        ${limitClause}
        ${offsetClause};
        `,
        values
    );

    return result.rows.map(normalizeWebsiteRow);
};

const getWebsiteById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            w.id,
            w.name,
            w.url,
            w.tag,
            w.check_interval_seconds AS "checkIntervalSeconds",
            w.is_paused AS "isPaused",
            w.is_public AS "isPublic",
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
            END AS "uptimePercentage",

            open_incident.id AS "openIncidentId",
            open_incident.started_at AS "incidentStartedAt"

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

        LEFT JOIN LATERAL (

            SELECT id, started_at

            FROM incidents

            WHERE website_id = w.id
            AND status = 'OPEN'

            ORDER BY started_at DESC

            LIMIT 1

        ) open_incident ON TRUE

        WHERE w.id = $1;
        `,
        [id]
    );

    return normalizeWebsiteRow(result.rows[0]);
};

const getDueWebsites = async () => {
    const result = await pool.query(`
        SELECT *
        FROM websites
        WHERE is_paused = FALSE
        AND (
            last_checked_at IS NULL
            OR last_checked_at <= CURRENT_TIMESTAMP - (check_interval_seconds || ' seconds')::interval
        )
        ORDER BY last_checked_at ASC NULLS FIRST;
    `);

    return result.rows.map(normalizeWebsiteRow);
};

const getPublicWebsites = async () => {
    return getAllWebsites({
        status: "ALL",
    }).then((websites) => websites.filter((website) => website.isPublic));
};

const markWebsiteChecked = async (id) => {
    await pool.query(
        `
        UPDATE websites
        SET last_checked_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [id]
    );
};

const updateWebsiteSettings = async (id, updates) => {
    const result = await pool.query(
        `
        UPDATE websites
        SET
            tag = COALESCE($2, tag),
            check_interval_seconds = COALESCE($3, check_interval_seconds),
            is_paused = COALESCE($4, is_paused),
            is_public = COALESCE($5, is_public)
        WHERE id = $1
        RETURNING *
        `,
        [
            id,
            updates.tag,
            updates.checkIntervalSeconds,
            updates.isPaused,
            updates.isPublic,
        ]
    );

    return normalizeWebsiteRow(result.rows[0]);
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
    getDueWebsites,
    getPublicWebsites,
    getWebsiteById,
    markWebsiteChecked,
    updateWebsiteSettings,
    deleteWebsiteById,
};
