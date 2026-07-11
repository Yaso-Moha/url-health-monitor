import { Eye, Globe, Pause, Play, RotateCw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "../utils/formatTime";
import { getFaviconUrl } from "../utils/websiteAssets";

export default function WebsiteCard({
    onCheckNow,
    onDelete,
    onTogglePaused,
    onTogglePublic,
    website,
}) {

    const status = website.status || "UNKNOWN";
    const faviconUrl = getFaviconUrl(website.url);

    return (

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300">

            <div className="flex justify-between gap-4">

                <div className="min-w-0">

                    <h2 className="text-xl font-bold flex items-center gap-2">

                        {faviconUrl ? (
                            <img
                                alt=""
                                className="h-6 w-6 rounded"
                                src={faviconUrl}
                            />
                        ) : (
                            <Globe size={20} />
                        )}

                        {website.name}

                    </h2>

                    <p className="text-slate-400 mt-1">

                        {website.url}

                    </p>

                </div>

                <div className="flex shrink-0 items-start gap-3">
                    <span
                        className={`px-4 py-2 rounded-xl font-semibold ${
                            status === "UP"
                                ? "bg-green-500/20 text-green-400"
                                : status === "DOWN"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-gray-500/20 text-gray-300"
                        }`}
                    >
                        {status}
                    </span>

                    <button
                        aria-label={`Delete ${website.name}`}
                        className="rounded-xl border border-slate-800 p-2 text-slate-400 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-400"
                        onClick={() => onDelete(website)}
                        type="button"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">

                <div>

                    <p className="text-slate-500">

                        Response

                    </p>

                    <h3 className="font-bold">

                        {website.responseTime
                            ? `${website.responseTime} ms`
                            : "--"}

                    </h3>

                </div>

                <div>

                    <p className="text-slate-500">

                        Uptime

                    </p>

                    <h3 className="font-bold">

                        {website.uptimePercentage === null
                            ? "--"
                            : `${website.uptimePercentage}%`}

                    </h3>

                </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                    <p className="text-slate-500">Last Checked</p>
                    <h3 className="font-bold">{formatRelativeTime(website.lastChecked)}</h3>
                </div>

                <div>
                    <p className="text-slate-500">Checks</p>
                    <h3 className="font-bold">{website.checkCount || 0}</h3>
                </div>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                        className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                        to={`/website/${website.id}`}
                    >
                        View details
                    </Link>

                    <div className="flex gap-2">
                        <button
                            className="rounded-lg border border-slate-800 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                            onClick={() => onCheckNow(website.id)}
                            title="Check now"
                            type="button"
                        >
                            <RotateCw size={16} />
                        </button>
                        <button
                            className="rounded-lg border border-slate-800 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                            onClick={() => onTogglePaused(website)}
                            title={website.isPaused ? "Resume monitoring" : "Pause monitoring"}
                            type="button"
                        >
                            {website.isPaused ? <Play size={16} /> : <Pause size={16} />}
                        </button>
                        <button
                            className={`rounded-lg border p-2 transition ${
                                website.isPublic
                                    ? "border-blue-500/60 bg-blue-500/10 text-blue-400"
                                    : "border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                            onClick={() => onTogglePublic(website)}
                            title={website.isPublic ? "Hide from public status" : "Show on public status"}
                            type="button"
                        >
                            <Eye size={16} />
                        </button>
                    </div>
                </div>
            </div>

        </div>

    );
}
