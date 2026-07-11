import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Globe, Pause, Play, RotateCw, Timer } from "lucide-react";
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
    const [incidents, setIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [settings, setSettings] = useState({
        checkIntervalSeconds: "60",
        isPaused: false,
        isPublic: false,
        tag: "",
    });

    useEffect(() => {
        const loadWebsiteDetails = async () => {
            try {
                setIsLoading(true);
                setError("");

                const [websiteResponse, historyResponse, incidentsResponse] = await Promise.all([
                    api.get(`/websites/${id}`),
                    api.get(`/history/${id}`),
                    api.get(`/history/${id}/incidents`),
                ]);

                setWebsite(websiteResponse.data);
                setHistory(historyResponse.data);
                setIncidents(incidentsResponse.data);
                setSettings({
                    checkIntervalSeconds: String(websiteResponse.data.checkIntervalSeconds || 60),
                    isPaused: Boolean(websiteResponse.data.isPaused),
                    isPublic: Boolean(websiteResponse.data.isPublic),
                    tag: websiteResponse.data.tag || "",
                });
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

    const refreshDetails = async () => {
        const [websiteResponse, historyResponse, incidentsResponse] = await Promise.all([
            api.get(`/websites/${id}`),
            api.get(`/history/${id}`),
            api.get(`/history/${id}/incidents`),
        ]);

        setWebsite(websiteResponse.data);
        setHistory(historyResponse.data);
        setIncidents(incidentsResponse.data);
    };

    const checkNow = async () => {
        await api.post(`/websites/${id}/check`);
        await refreshDetails();
    };

    const saveSettings = async (event) => {
        event.preventDefault();

        await api.patch(`/websites/${id}`, {
            checkIntervalSeconds: Number(settings.checkIntervalSeconds),
            isPaused: settings.isPaused,
            isPublic: settings.isPublic,
            tag: settings.tag,
        });

        await refreshDetails();
    };

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

                        {website.openIncidentId && (
                            <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-red-200">
                                <h3 className="text-lg font-bold">Active incident</h3>
                                <p className="mt-1 text-sm">
                                    Started {formatRelativeTime(website.incidentStartedAt)}.
                                </p>
                            </div>
                        )}

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

                        <section className="mt-8 grid gap-6 lg:grid-cols-2">
                            <form
                                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                                onSubmit={saveSettings}
                            >
                                <h3 className="text-2xl font-bold">Settings</h3>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-300">Tag</span>
                                        <input
                                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                                            onChange={(event) =>
                                                setSettings((current) => ({ ...current, tag: event.target.value }))
                                            }
                                            value={settings.tag}
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-300">Interval</span>
                                        <select
                                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                                            onChange={(event) =>
                                                setSettings((current) => ({
                                                    ...current,
                                                    checkIntervalSeconds: event.target.value,
                                                }))
                                            }
                                            value={settings.checkIntervalSeconds}
                                        >
                                            <option value="30">30 seconds</option>
                                            <option value="60">1 minute</option>
                                            <option value="300">5 minutes</option>
                                            <option value="900">15 minutes</option>
                                            <option value="3600">1 hour</option>
                                        </select>
                                    </label>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-4">
                                    <label className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                                        <input
                                            checked={settings.isPaused}
                                            className="h-4 w-4 accent-blue-600"
                                            onChange={(event) =>
                                                setSettings((current) => ({
                                                    ...current,
                                                    isPaused: event.target.checked,
                                                }))
                                            }
                                            type="checkbox"
                                        />
                                        Paused
                                    </label>

                                    <label className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                                        <input
                                            checked={settings.isPublic}
                                            className="h-4 w-4 accent-blue-600"
                                            onChange={(event) =>
                                                setSettings((current) => ({
                                                    ...current,
                                                    isPublic: event.target.checked,
                                                }))
                                            }
                                            type="checkbox"
                                        />
                                        Public status
                                    </label>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button
                                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700"
                                        type="submit"
                                    >
                                        Save Settings
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                        onClick={checkNow}
                                        type="button"
                                    >
                                        <RotateCw size={18} />
                                        Check Now
                                    </button>
                                </div>
                            </form>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                                <h3 className="text-2xl font-bold">Monitoring State</h3>
                                <div className="mt-5 flex items-center gap-3">
                                    <div
                                        className={`rounded-xl p-3 ${
                                            website.isPaused ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"
                                        }`}
                                    >
                                        {website.isPaused ? <Pause /> : <Play />}
                                    </div>
                                    <div>
                                        <p className="font-bold">
                                            {website.isPaused ? "Monitoring paused" : "Monitoring active"}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            Checks every {website.checkIntervalSeconds} seconds.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <ResponseTimeChart history={history} />

                        <section className="mt-10">
                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                                <div>
                                    <h3 className="text-2xl font-bold">Incidents</h3>
                                    <p className="mt-1 text-slate-400">Downtime windows and recovery history.</p>
                                </div>

                                <span className="text-sm font-semibold text-slate-500">
                                    {incidents.length} incidents
                                </span>
                            </div>

                            {incidents.length === 0 ? (
                                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-500">
                                    No incidents recorded.
                                </div>
                            ) : (
                                <div className="mt-6 space-y-4">
                                    {incidents.map((incident) => (
                                        <div
                                            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                                            key={incident.id}
                                        >
                                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                                <span
                                                    className={`w-fit rounded-lg px-3 py-1 text-sm font-semibold ${
                                                        incident.status === "OPEN"
                                                            ? "bg-red-500/20 text-red-400"
                                                            : "bg-green-500/20 text-green-400"
                                                    }`}
                                                >
                                                    {incident.status}
                                                </span>
                                                <p className="text-sm text-slate-400">
                                                    Started {formatRelativeTime(incident.startedAt)}
                                                </p>
                                            </div>
                                            <p className="mt-3 text-slate-400">{incident.reason}</p>
                                            <p className="mt-2 text-sm text-slate-500">
                                                Duration: {Math.round((incident.durationSeconds || 0) / 60)} minutes
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

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
