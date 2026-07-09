export default function ResponseTimeChart({ history }) {
    const chartHistory = history
        .filter((check) => typeof check.responseTime === "number")
        .slice(0, 24)
        .reverse();

    if (chartHistory.length < 2) {
        return (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-500">
                More checks are needed before a response time chart can be drawn.
            </div>
        );
    }

    const width = 720;
    const height = 220;
    const padding = 24;
    const responseTimes = chartHistory.map((check) => check.responseTime);
    const minResponse = Math.min(...responseTimes);
    const maxResponse = Math.max(...responseTimes);
    const range = Math.max(maxResponse - minResponse, 1);

    const points = chartHistory.map((check, index) => {
        const x = padding + (index / (chartHistory.length - 1)) * (width - padding * 2);
        const y = height - padding - ((check.responseTime - minResponse) / range) * (height - padding * 2);

        return {
            id: check.id,
            status: check.status,
            responseTime: check.responseTime,
            x,
            y,
        };
    });

    const path = points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ");

    return (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                    <h3 className="text-2xl font-bold">Response Time Chart</h3>
                    <p className="mt-1 text-slate-400">Last {chartHistory.length} checks.</p>
                </div>

                <span className="text-sm font-semibold text-slate-500">
                    {minResponse} ms - {maxResponse} ms
                </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                <svg
                    aria-label="Response time chart"
                    className="h-64 w-full"
                    preserveAspectRatio="none"
                    role="img"
                    viewBox={`0 0 ${width} ${height}`}
                >
                    <defs>
                        <linearGradient id="responseGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <path
                        d={`${path} L ${points.at(-1).x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
                        fill="url(#responseGradient)"
                    />
                    <path d={path} fill="none" stroke="#60a5fa" strokeLinecap="round" strokeWidth="4" />

                    {points.map((point) => (
                        <circle
                            cx={point.x}
                            cy={point.y}
                            fill={point.status === "UP" ? "#22c55e" : "#ef4444"}
                            key={point.id}
                            r="5"
                        >
                            <title>{`${point.responseTime} ms (${point.status})`}</title>
                        </circle>
                    ))}
                </svg>
            </div>
        </div>
    );
}
