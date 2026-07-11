export default function ConfirmModal({
    confirmLabel = "Confirm",
    isOpen,
    message,
    onCancel,
    onConfirm,
    title,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-slate-400">{message}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        onClick={onCancel}
                        type="button"
                    >
                        Cancel
                    </button>

                    <button
                        className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                        onClick={onConfirm}
                        type="button"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
