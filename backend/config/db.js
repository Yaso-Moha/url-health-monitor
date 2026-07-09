const { Pool } = require("pg");

const pool = new Pool({
    host: "postgres",
    port: 5432,
    database: "url_monitor",
    user: "postgres",
    password: "password",
});

module.exports = pool;