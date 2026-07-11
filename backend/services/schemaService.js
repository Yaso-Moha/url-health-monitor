const pool = require("../config/db");

const ensureSchema = async () => {
    await pool.query(`
        ALTER TABLE websites
        ADD COLUMN IF NOT EXISTS tag VARCHAR(50),
        ADD COLUMN IF NOT EXISTS check_interval_seconds INTEGER NOT NULL DEFAULT 60,
        ADD COLUMN IF NOT EXISTS is_paused BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMP;

        CREATE TABLE IF NOT EXISTS incidents (
            id SERIAL PRIMARY KEY,
            website_id INTEGER REFERENCES websites(id) ON DELETE CASCADE,
            started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP,
            status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
            reason TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_url_checks_website_checked_at
        ON url_checks (website_id, checked_at DESC);

        CREATE INDEX IF NOT EXISTS idx_incidents_website_status
        ON incidents (website_id, status);
    `);
};

module.exports = {
    ensureSchema,
};
