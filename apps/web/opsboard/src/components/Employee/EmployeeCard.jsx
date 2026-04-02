export function EmployeeCard({ employee, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full bg-slate-800 p-4 rounded shadow hover:border-slate-700 transition cursor-pointer border border-slate-800 text-left"
        >
            <h3 className="text-lg font-semibold text-slate-100">{employee.name}</h3>
            <p className="text-sm text-slate-500">{employee.role}</p>
        </button>
    )
}