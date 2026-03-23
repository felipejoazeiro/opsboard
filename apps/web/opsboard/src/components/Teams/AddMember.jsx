import { useMemo, useState } from "react";
import { addEmployeeToTeam } from "../../services/teams.service";

const DEFAULT_PAGE_SIZE = 8;

export const AddMember = ({
  teamId,
  employees = [],
  memberIds = [],
  pageSize = DEFAULT_PAGE_SIZE,
  onMembersAdded,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const normalizedMemberIds = useMemo(
    () => new Set(memberIds.map((id) => String(id))),
    [memberIds],
  );

  const normalizedSearch = search.trim().toLowerCase();

  const availableEmployees = useMemo(() => {
    return employees.filter((employee) => {
      if (!employee?.id) return false;
      return !normalizedMemberIds.has(String(employee.id));
    });
  }, [employees, normalizedMemberIds]);

  const filteredEmployees = useMemo(() => {
    if (!normalizedSearch) return availableEmployees;

    return availableEmployees.filter((employee) =>
      employee.name?.toLowerCase().includes(normalizedSearch),
    );
  }, [availableEmployees, normalizedSearch]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / pageSize),
  );
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + pageSize,
  );

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function toggleSelection(employeeId) {
    const normalizedId = String(employeeId);

    setSelectedIds((current) => {
      if (current.includes(normalizedId)) {
        return current.filter((id) => id !== normalizedId);
      }

      return [...current, normalizedId];
    });
  }

  function toggleCurrentPageSelection() {
    const pageIds = paginatedEmployees.map((employee) => String(employee.id));
    const allSelected = pageIds.every((id) => selectedIds.includes(id));

    setSelectedIds((current) => {
      if (allSelected) {
        return current.filter((id) => !pageIds.includes(id));
      }

      const merged = new Set([...current, ...pageIds]);
      return [...merged];
    });
  }

  async function handleAddSelected() {
    if (!teamId || selectedIds.length === 0) {
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const results = await Promise.allSettled(
        selectedIds.map((employeeId) => addEmployeeToTeam(teamId, employeeId)),
      );

      const fulfilled = results.filter(
        (result) => result.status === "fulfilled",
      ).length;
      const rejected = results.length - fulfilled;

      if (fulfilled > 0) {
        setSelectedIds((current) =>
          current.filter((id) => !selectedIds.includes(id)),
        );
      }

      if (typeof onMembersAdded === "function") {
        onMembersAdded({
          addedEmployeeIds: selectedIds,
          fulfilled,
          rejected,
          results,
        });
      }

      if (rejected > 0) {
        setFeedback({
          type: "warning",
          message: `${fulfilled} membro(s) adicionados e ${rejected} falharam.`,
        });
        return;
      }

      setFeedback({
        type: "success",
        message: `${fulfilled} membro(s) adicionados com sucesso.`,
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Erro ao adicionar membros ao time.",
      });
    } finally {
      setLoading(false);
    }
  }

  const canGoPrevious = safePage > 1;
  const canGoNext = safePage < totalPages;
  const hasEmployees = filteredEmployees.length > 0;
  const hasSelection = selectedIds.length > 0;
  const allCurrentPageSelected =
    paginatedEmployees.length > 0 &&
    paginatedEmployees.every((employee) =>
      selectedIds.includes(String(employee.id)),
    );

  return (
    <div className="space-y-4 rounded-md bg-slate-800 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-100">Adicionar membro</p>
          <p className="text-xs text-slate-500">
            Pesquise por nome, selecione e adicione ao time.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar empregado por nome"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-700 bg-slate-900/50">
        <div className="flex items-center justify-between border-b border-slate-700 px-3 py-2">
          <p className="text-xs text-slate-400">
            {filteredEmployees.length} empregado(s) encontrado(s)
          </p>
          <button
            type="button"
            onClick={toggleCurrentPageSelection}
            disabled={paginatedEmployees.length === 0}
            className="text-xs text-cyan-400 transition hover:text-cyan-300 disabled:cursor-not-allowed disabled:text-slate-500"
          >
            {allCurrentPageSelected ? "Desmarcar página" : "Selecionar página"}
          </button>
        </div>

        {!hasEmployees && (
          <p className="px-3 py-6 text-sm text-slate-500">
            Nenhum empregado disponível para adicionar.
          </p>
        )}

        {hasEmployees && (
          <ul className="divide-y divide-slate-800">
            {paginatedEmployees.map((employee) => {
              const normalizedId = String(employee.id);
              const checked = selectedIds.includes(normalizedId);

              return (
                <li
                  key={employee.id}
                  className="flex items-center justify-between gap-2 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-200">
                      {employee.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {employee.email}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelection(employee.id)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => current - 1)}
            disabled={!canGoPrevious}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-xs text-slate-400">
            Página {safePage} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={!canGoNext}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima
          </button>
        </div>

        <button
          type="button"
          disabled={!hasSelection || loading || !teamId}
          onClick={handleAddSelected}
          className="rounded-md bg-green-500 px-3 py-2 text-xs font-medium text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Adicionando..."
            : `Adicionar selecionados (${selectedIds.length})`}
        </button>
      </div>

      {feedback && (
        <p
          className={`text-xs ${
            feedback.type === "success"
              ? "text-green-400"
              : feedback.type === "warning"
                ? "text-amber-400"
                : "text-red-400"
          }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
};
