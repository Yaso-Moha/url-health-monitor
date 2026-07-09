import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import api from "../services/api";

const initialForm = {
    name: "",
    url: "",
};

export default function AddWebsiteModal({ onWebsiteAdded, onNotify }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeModal = () => {
        if (isSubmitting) {
            return;
        }

        setIsOpen(false);
        setFormData(initialForm);
        setErrors({});
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const nextErrors = {};
        const name = formData.name.trim();
        const url = formData.url.trim();

        if (!name) {
            nextErrors.name = "Website name is required.";
        }

        if (!url) {
            nextErrors.url = "Website URL is required.";
        } else {
            try {
                const parsedUrl = new URL(url);

                if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                    nextErrors.url = "URL must start with http:// or https://.";
                }
            } catch {
                nextErrors.url = "Enter a valid URL, including http:// or https://.";
            }
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post("/websites", {
                name: formData.name.trim(),
                url: formData.url.trim(),
            });

            setIsOpen(false);
            setFormData(initialForm);
            setErrors({});
            await onWebsiteAdded();
            onNotify("success", "Website added successfully.");
        } catch (err) {
            const message = err.response?.data?.error || "Failed to add website. Please try again.";
            onNotify("error", message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl font-semibold"
                onClick={() => setIsOpen(true)}
                type="button"
            >
                <Plus size={18} />
                Add Website
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
                    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-2xl font-bold">Add Website</h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    Add a URL to monitor its uptime and response time.
                                </p>
                            </div>

                            <button
                                aria-label="Close modal"
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                onClick={closeModal}
                                type="button"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300" htmlFor="website-name">
                                    Website Name
                                </label>
                                <input
                                    className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 ${
                                        errors.name ? "border-red-500" : "border-slate-700"
                                    }`}
                                    id="website-name"
                                    name="name"
                                    onChange={handleChange}
                                    placeholder="Example Site"
                                    type="text"
                                    value={formData.name}
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300" htmlFor="website-url">
                                    Website URL
                                </label>
                                <input
                                    className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 ${
                                        errors.url ? "border-red-500" : "border-slate-700"
                                    }`}
                                    id="website-url"
                                    name="url"
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                    type="url"
                                    value={formData.url}
                                />
                                {errors.url && (
                                    <p className="mt-2 text-sm text-red-400">{errors.url}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                    disabled={isSubmitting}
                                    onClick={closeModal}
                                    type="button"
                                >
                                    Cancel
                                </button>

                                <button
                                    className="inline-flex min-w-28 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                                    disabled={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                                    {isSubmitting ? "Adding" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
