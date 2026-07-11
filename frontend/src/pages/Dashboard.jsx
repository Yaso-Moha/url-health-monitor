import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  XCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import WebsiteCard from "../components/WebsiteCard";
import AddWebsiteModal from "../components/AddWebsiteModal";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";

const WebsiteCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <div className="flex justify-between gap-4">
      <div className="w-full max-w-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-800" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-800" />
      </div>
      <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-800" />
    </div>

    <div className="mt-8 grid grid-cols-2 gap-6">
      <div>
        <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />
        <div className="mt-3 h-5 w-16 animate-pulse rounded bg-slate-800" />
      </div>
      <div>
        <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
        <div className="mt-3 h-5 w-24 animate-pulse rounded bg-slate-800" />
      </div>
    </div>
  </div>
);

const pageSize = 6;

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return `"${String(value).replaceAll("\"", "\"\"")}"`;
};

export default function Dashboard({ onToggleTheme, theme }) {
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [websiteToDelete, setWebsiteToDelete] = useState(null);

  useEffect(() => {
    loadWebsites();

    const intervalId = setInterval(loadWebsites, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setNotification(null);
    }, 3500);

    return () => clearTimeout(timeoutId);
  }, [notification]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, statusFilter]);

  const loadWebsites = async () => {
    try {
      const res = await api.get("/websites");

      setWebsites(res.data);
    } catch (err) {
      console.error("Failed to load websites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const deleteWebsite = async () => {
    if (!websiteToDelete) {
      return;
    }

    try {
      await api.delete(`/websites/${websiteToDelete.id}`);
      await loadWebsites();
      showNotification("success", "Website deleted successfully.");
    } catch (err) {
      const message = err.response?.data?.error || "Failed to delete website. Please try again.";
      showNotification("error", message);
    } finally {
      setWebsiteToDelete(null);
    }
  };

  const checkWebsiteNow = async (id) => {
    try {
      await api.post(`/websites/${id}/check`);
      await loadWebsites();
      showNotification("success", "Website checked.");
    } catch (err) {
      const message = err.response?.data?.error || "Failed to check website.";
      showNotification("error", message);
    }
  };

  const updateWebsiteSettings = async (website, updates, successMessage) => {
    try {
      await api.patch(`/websites/${website.id}`, updates);
      await loadWebsites();
      showNotification("success", successMessage);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to update website.";
      showNotification("error", message);
    }
  };

  const togglePaused = (website) => {
    updateWebsiteSettings(
      website,
      { isPaused: !website.isPaused },
      website.isPaused ? "Monitoring resumed." : "Monitoring paused."
    );
  };

  const togglePublic = (website) => {
    updateWebsiteSettings(
      website,
      { isPublic: !website.isPublic },
      website.isPublic ? "Hidden from public status page." : "Added to public status page."
    );
  };

  const exportWebsites = () => {
    const headers = [
      "Name",
      "URL",
      "Status",
      "Response Time",
      "Uptime Percentage",
      "Checks",
      "Last Checked",
    ];

    const rows = filteredWebsites.map((website) => [
      website.name,
      website.url,
      website.status || "UNKNOWN",
      website.responseTime || "",
      website.uptimePercentage ?? "",
      website.checkCount || 0,
      website.lastChecked || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "url-health-monitor-websites.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredWebsites = websites
    .filter((website) => {
      if (statusFilter === "ALL") {
        return true;
      }

      return website.status === statusFilter;
    })
    .filter((website) => {
      if (!normalizedSearchTerm) {
        return true;
      }

      return (
        website.name.toLowerCase().includes(normalizedSearchTerm) ||
        website.url.toLowerCase().includes(normalizedSearchTerm)
      );
    })
    .sort((firstWebsite, secondWebsite) => {
      if (sortBy === "oldest") {
        return new Date(firstWebsite.created_at) - new Date(secondWebsite.created_at);
      }

      if (sortBy === "fastest") {
        return (firstWebsite.responseTime ?? Number.MAX_SAFE_INTEGER) -
          (secondWebsite.responseTime ?? Number.MAX_SAFE_INTEGER);
      }

      if (sortBy === "slowest") {
        return (secondWebsite.responseTime ?? -1) - (firstWebsite.responseTime ?? -1);
      }

      if (sortBy === "alphabetical") {
        return firstWebsite.name.localeCompare(secondWebsite.name);
      }

      return new Date(secondWebsite.created_at) - new Date(firstWebsite.created_at);
    });
  const totalPages = Math.max(Math.ceil(filteredWebsites.length / pageSize), 1);
  const paginatedWebsites = filteredWebsites.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const websitesWithResponseTimes = websites.filter((website) => website.responseTime);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar onToggleTheme={onToggleTheme} theme={theme} />
      <ConfirmModal
        confirmLabel="Delete"
        isOpen={Boolean(websiteToDelete)}
        message={
          websiteToDelete
            ? `Delete ${websiteToDelete.name}? This removes its checks and incidents.`
            : ""
        }
        onCancel={() => setWebsiteToDelete(null)}
        onConfirm={deleteWebsite}
        title="Delete Website"
      />

      <div className="max-w-7xl mx-auto px-8 py-10">
        {notification && (
          <div
            className={`fixed right-6 top-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-xl ${
              notification.type === "success"
                ? "border-green-500/40 bg-green-500/15 text-green-200"
                : "border-red-500/40 bg-red-500/15 text-red-200"
            }`}
            role="status"
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-bold">Dashboard</h2>

          <AddWebsiteModal
            onNotify={showNotification}
            onWebsiteAdded={loadWebsites}
          />
        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-10">
          <StatsCard
            title="Websites"
            value={websites.length}
            color="text-blue-400"
          />

          <StatsCard
            title="Online"
            value={websites.filter((w) => w.status === "UP").length}
            color="text-green-400"
          />

          <StatsCard
            title="Offline"
            value={websites.filter((w) => w.status === "DOWN").length}
            color="text-red-400"
          />

          <StatsCard
            title="Avg Response"
            value={
              websitesWithResponseTimes.length
                ? `${Math.round(
                    websitesWithResponseTimes.reduce((a, b) => a + b.responseTime, 0) /
                      websitesWithResponseTimes.length
                  )} ms`
                : "--"
            }
            color="text-yellow-400"
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-fit rounded-xl border border-slate-800 bg-slate-900 p-1">
            {[
              ["ALL", "All"],
              ["UP", "Online"],
              ["DOWN", "Offline"],
            ].map(([value, label]) => (
              <button
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === value
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
                key={value}
                onClick={() => setStatusFilter(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={filteredWebsites.length === 0}
              onClick={exportWebsites}
              type="button"
            >
              <Download size={18} />
              Export CSV
            </button>

            <label className="relative w-full sm:w-56">
              <span className="sr-only">Sort websites</span>
              <ArrowUpDown
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <select
                className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
                onChange={(event) => setSortBy(event.target.value)}
                value={sortBy}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="fastest">Fastest Response</option>
                <option value="slowest">Slowest Response</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </label>

            <label className="relative w-full max-w-md">
              <span className="sr-only">Search websites</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={20}
              />
              <input
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or URL"
                type="search"
                value={searchTerm}
              />
            </label>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-10">
          {isLoading ? (
            <>
              <WebsiteCardSkeleton />
              <WebsiteCardSkeleton />
            </>
          ) : websites.length === 0 ? (
            <div className="col-span-2 text-center py-20 text-slate-500">
              No websites added yet. Add your first URL to start monitoring.
            </div>
          ) : filteredWebsites.length === 0 ? (
            <div className="col-span-2 text-center py-20 text-slate-500">
              No websites match your search.
            </div>
          ) : (
            paginatedWebsites.map((website) => (
              <WebsiteCard
                key={website.id}
                onCheckNow={checkWebsiteNow}
                onDelete={setWebsiteToDelete}
                onTogglePaused={togglePaused}
                onTogglePublic={togglePublic}
                website={website}
              />
            ))
          )}
        </div>

        {!isLoading && filteredWebsites.length > pageSize && (
          <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                type="button"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <button
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                type="button"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
