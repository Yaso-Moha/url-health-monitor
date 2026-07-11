import { Activity, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({ onToggleTheme, theme }) {
    return (
        <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800">

            <div className="flex items-center gap-3">

                <div className="bg-blue-600 p-2 rounded-xl">
                    <Activity size={24}/>
                </div>

                <div>

                    <h1 className="text-2xl font-bold">
                        URL Health Monitor
                    </h1>

                    <p className="text-slate-400 text-sm">
                        Monitor your websites in real time
                    </p>

                </div>

            </div>

            <div className="flex items-center gap-3">
                <Link
                    className="rounded-xl border border-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
                    to="/status"
                >
                    Public Status
                </Link>

                {onToggleTheme && (
                    <button
                        aria-label="Toggle theme"
                        className="rounded-xl border border-slate-800 p-3 text-slate-300 transition hover:bg-slate-900 hover:text-white"
                        onClick={onToggleTheme}
                        type="button"
                    >
                        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                )}
            </div>

        </nav>
    );
}
