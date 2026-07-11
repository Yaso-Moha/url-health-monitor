const requestCounts = new Map();

const rateLimiter = (req, res, next) => {
    const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000;
    const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 300;
    const key = req.ip || "unknown";
    const now = Date.now();
    const record = requestCounts.get(key) || {
        count: 0,
        resetAt: now + windowMs,
    };

    if (now > record.resetAt) {
        record.count = 0;
        record.resetAt = now + windowMs;
    }

    record.count += 1;
    requestCounts.set(key, record);

    if (record.count > maxRequests) {
        return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    next();
};

module.exports = rateLimiter;
