import { useState } from "react";

export function UpdateEmployee({ employee, onUpdate, onClose }) {
  const [name, setName] = useState(employee.name);
  const [position, setPosition] = useState(employee.position);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onUpdate(employee.id, { name, position });
      onClose();
    } catch (error) {
      setError(error.message || "Failed to update employee.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">
            Edit Employee
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-200"
            aria-label="Close edit employee"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Position
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-600 disabled:bg-cyan-400"
          >
            {loading ? "Updating..." : "Update Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}
