import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Globe, Timer } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ResponseTimeChart from "../components/ResponseTimeChart";
import api from "../services/api";
import { formatRelativeTime } from "../utils/formatTime";
import { getFaviconUrl } from "../utils/websiteAssets";

export default function WebsiteDetails({ onToggleTheme, theme }) {
    const { id } = useParams();
    const [website, setWebsite] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadWebsiteDetails = async () => {
            try {
                setIsLoading(true);
                setError("");

                const [websiteResponse, historyResponse] = await Promise.all([
                    api.get(`/websites/${id}`),
                    api.get(`/history/${id}`),
                ]);

                setWebsite(websiteResponse.data);
                setHistory(historyResponse.data);
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load website details.");
            } finally {
                setIsLoading(false);
            }
        };

        loadWebsiteDetails();
    }, [id]);

    const status = website?.status || "UNKNOWN";
    const faviconUrl = website ? getFaviconUrl(website.url) : "";

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar onToggleTheme={onToggleTheme} theme={theme} />

            <main className="mx-auto max-w-7xl px-8 py-10">
                <Link
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
                    to="/"
                >
                    <ArrowLeft size={18} />
                    Back to dashboard
                </Link>

                {isLoading ? (
                    <div className="mt-16 text-center text-slate-400">Loading website details...</div>
                ) : error ? (
                    <div className="mt-10 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
                        {error}
                    </div>
                ) : (
                    <>
                        <section className="mt-8 flex flex-col justify-between gap-6 border-b border-slate-800 pb-8 lg:flex-row lg:items-start">
                            <div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    {faviconUrl ? (
                                        <img alt="" className="h-7 w-7 rounded" src={faviconUrl} />
                                    ) : (
                                        <Globe size={22} />
                                    )}
                                    <span>{website.url}</span>
                                </div>

                                <h2 className="mt-3 text-4xl font-bold">{website.name}</h2>
                                <p className="mt-2 text-slate-400">
                                    Added {formatRelativeTime(website.created_at)}
                                </p>
                            </div>

                            <span
                                className={`w-fit rounded-xl px-4 py-2 font-semibold ${
                                    status === "UP"
                                        ? "bg-green-500/20 text-green-400"
                                        : status === "DOWN"
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-gray-500/20 text-gray-300"
                                }`}
                            >
                                {status}
                            </span>
                        </section>

                        <section className="mt-8 grid gap-6 md:grid-cols-4">
                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                                <p className="text-slate-400">Current Status</p>
                                <h3 className="mt-2 text-3xl font-bold">{status}</h3>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                                <p className="flex items-center gap-2 text-slate-400">
                                    <Timer size={18} />
                                    Latest Response
                                </p>
                                <h3 className="mt-2 text-3xl font-bold">
                                    {website.responseTime ? `${website.responseTime} ms` : "--"}
                                </h3>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                                <p className="flex items-center gap-2 text-slate-400">
                                    <Clock size={18} />
                                    Last Checked
                                </p>
                                <h3 className="mt-2 text-lg font-bold">
                                    {formatRelativeTime(website.lastChecked)}
                                </h3>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                                <p className="text-slate-400">Uptime</p>
                                <h3 className="mt-2 text-3xl font-bold">
                                    {website.uptimePercentage === null
                                        ? "--"
                                        : `${website.uptimePercentage}%`}
                                </h3>
                            </div>
                        </section>

                        <ResponseTimeChart history={history} />

                        <section className="mt-10">
                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                                <div>
                                    <h3 className="text-2xl font-bold">History Timeline</h3>
                                    <p className="mt-1 text-slate-400">Recent checks, newest first.</p>
                                </div>

                                <span className="text-sm font-semibold text-slate-500">
                                    {history.length} checks
                                </span>
                            </div>

                            {history.length === 0 ? (
                                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-500">
                                    No checks recorded yet.
                                </div>
                            ) : (
                                <div className="mt-6 space-y-4">
                                    {history.map((check) => (
                                        <div
                                            className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:flex-row md:items-center"
                                            key={check.id}
                                        >
                                            <div>
                                                <span
                                                    className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                                                        check.status === "UP"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : "bg-red-500/20 text-red-400"
                                                    }`}
                                                >
                                                    {check.status}
                                                </span>
                                                <p className="mt-3 text-slate-400">
                                                    {formatRelativeTime(check.checkedAt)}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 text-right">
                                                <div>
                                                    <p className="text-sm text-slate-500">Status Code</p>
                                                    <p className="font-bold">{check.status_code || "--"}</p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-slate-500">Response</p>
                                                    <p className="font-bold">
                                                        {check.responseTime ? `${check.responseTime} ms` : "--"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
