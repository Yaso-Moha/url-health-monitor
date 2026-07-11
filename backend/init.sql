CREATE TABLE IF NOT EXISTS websites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL UNIQUE,
    tag VARCHAR(50),
    check_interval_seconds INTEGER NOT NULL DEFAULT 60,
    is_paused BOOLEAN NOT NULL DEFAULT FALSE,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    last_checked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS url_checks (
    id SERIAL PRIMARY KEY,
    website_id INTEGER REFERENCES websites(id) ON DELETE CASCADE,
    status VARCHAR(10),
    status_code INTEGER,
    response_time INTEGER,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
