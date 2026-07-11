import { useEffect, useState } from "react";
import { Activity, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { formatRelativeTime } from "../utils/formatTime";
import { getFaviconUrl } from "../utils/websiteAssets";

export default function PublicStatus() {
    const [websites, setWebsites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStatus = async () => {
            try {
                const response = await api.get("/websites/public/status");
                setWebsites(response.data);
            } finally {
                setIsLoading(false);
            }
        };

        loadStatus();
        const intervalId = setInterval(loadStatus, 30000);

        return () => clearInterval(intervalId);
    }, []);

    const hasOutage = websites.some((website) => website.status === "DOWN");

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <main className="mx-auto max-w-5xl px-8 py-10">
                <Link
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
                    to="/"
                >
                    <ArrowLeft size={18} />
                    Back to dashboard
                </Link>

                <section className="mt-10 border-b border-slate-800 pb-8">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-600 p-3">
                            <Activity size={28} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Public Status</h1>
                            <p className="mt-1 text-slate-400">
                                Current availability for public monitored services.
                            </p>
                        </div>
                    </div>

                    <div
                        className={`mt-8 rounded-2xl border p-6 ${
                            hasOutage
                                ? "border-red-500/40 bg-red-500/10 text-red-200"
                                : "border-green-500/40 bg-green-500/10 text-green-200"
                        }`}
                    >
                        <div className="flex items-center gap-3 text-2xl font-bold">
                            {hasOutage ? <XCircle /> : <CheckCircle />}
                            {hasOutage ? "Some systems are down" : "All public systems operational"}
                        </div>
                    </div>
                </section>

                <section className="mt-8 space-y-4">
                    {isLoading ? (
                        <div className="text-center text-slate-400">Loading status...</div>
                    ) : websites.length === 0 ? (
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-500">
                            No public websites have been enabled yet.
                        </div>
                    ) : (
                        websites.map((website) => {
                            const faviconUrl = getFaviconUrl(website.url);

                            return (
                                <div
                                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center"
                                    key={website.id}
                                >
                                    <div className="flex items-center gap-3">
                                        {faviconUrl && (
                                            <img alt="" className="h-7 w-7 rounded" src={faviconUrl} />
                                        )}
                                        <div>
                                            <h2 className="text-lg font-bold">{website.name}</h2>
                                            <p className="text-sm text-slate-400">
                                                {website.uptimePercentage ?? "--"}% uptime
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <span
                                            className={`rounded-xl px-4 py-2 font-semibold ${
                                                website.status === "UP"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : website.status === "DOWN"
                                                    ? "bg-red-500/20 text-red-400"
                                                    : "bg-gray-500/20 text-gray-300"
                                            }`}
                                        >
                                            {website.status || "UNKNOWN"}
                                        </span>
                                        <p className="mt-3 text-sm text-slate-500">
                                            Checked {formatRelativeTime(website.lastChecked)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </section>
            </main>
        </div>
    );
}
