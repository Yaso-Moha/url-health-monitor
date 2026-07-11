const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const urlRoutes = require("./routes/urlRoutes");
const websiteRoutes = require("./routes/websiteRoutes");
const historyRoutes = require("./routes/historyRoutes");

const startCron = require("./services/cronService");
const { ensureSchema } = require("./services/schemaService");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");
const requestLogger = require("./middleware/requestLogger");

const app = express();

// Allow frontend requests
app.use(
    cors({
        origin(origin, callback) {
            if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):517\d$/.test(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
    })
);

app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

app.get("/api/health", (req, res) => {
    res.json({
        service: "url-health-monitor-api",
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api", urlRoutes);
app.use("/api/websites", websiteRoutes);
app.use("/api/history", historyRoutes);
app.use(errorHandler);

const PORT = 3000;

pool.query("SELECT NOW()")
    .then(() => {
        console.log("✅ Connected to PostgreSQL");
        return ensureSchema();
    })
    .then(() => {
        console.log("✅ Database schema ready");
        startCron();
    })
    .catch((err) => {
        console.error("❌ Database connection failed");
        console.error(err.message);
    });

app.listen(PORT, () => {
    console.log(`🚀 URL Health Monitor API Started on port ${PORT}`);
});
