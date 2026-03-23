import { useEffect, useState } from "react";
import { Header } from "../components/Teams/Header";
import { SearchInput } from "../components/Teams/SearchInput";
import { NewTeamCard } from "../components/Teams/NewTeamCard";
import { AddMember } from "../components/Teams/AddMember";
import { useTeams } from "../hooks/useTeams";
import { TeamCard } from "../components/Teams/TeamCard";
import { Sidebar } from "../components/Shared/SideBar";
import {
  createTeam,
  fetchEmployeesForTeams,
  fetchTeamMembers,
  removeEmployeeToTeam,
} from "../services/teams.service";
export function TeamsPage() {
  const [employees, setEmployees] = useState([]);
  const [employeesError, setEmployeesError] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const {
    teams,
    loading,
    error,
    load,
    search,
    setSearch,
    isNewTeamOpen,
    setIsNewTeamOpen,
    addingMembersTeam,
    setAddingMembersTeam,
  } = useTeams();

  useEffect(() => {
    if (!addingMembersTeam) return;

    let cancelled = false;

    async function loadEmployees() {
      setEmployeesError(null);
      try {
        const result = await fetchEmployeesForTeams({ page: 1, pageSize: 100 });
        if (!cancelled) {
          setEmployees(Array.isArray(result.data) ? result.data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setEmployees([]);
          setEmployeesError(err.message || "Erro ao buscar funcionários.");
        }
      }
    }

    loadEmployees();

    return () => {
      cancelled = true;
    };
  }, [addingMembersTeam]);

  useEffect(() => {
    if (!addingMembersTeam) return;

    let cancelled = false;

    async function loadTeamMembers() {
      setMembersLoading(true);
      setMembersError(null);
      try {
        const result = await fetchTeamMembers(addingMembersTeam.id);
        if (!cancelled) {
          setTeamMembers(Array.isArray(result.data) ? result.data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setTeamMembers([]);
          setMembersError(err.message || "Erro ao buscar membros da equipe.");
        }
      } finally {
        if (!cancelled) {
          setMembersLoading(false);
        }
      }
    }

    loadTeamMembers();

    return () => {
      cancelled = true;
    };
  }, [addingMembersTeam]);

  async function handleRemoveMember(employeeId) {
    if (!addingMembersTeam?.id) return;

    try {
      await removeEmployeeToTeam(addingMembersTeam.id, employeeId);
      setTeamMembers((current) => current.filter((member) => member.id !== employeeId));
      load();
    } catch (err) {
      setMembersError(err.message || "Erro ao remover membro da equipe.");
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 px-6 py-8 md:px-10">
        <Header setIsNewTeamOpen={setIsNewTeamOpen} />
        <SearchInput
          searchTerm={search}
          setSearchTerm={setSearch}
        />
        {loading && (
          <div className="flex items-center justify-center py-24">
            <svg
              className="h-8 w-8 animate-spin text-cyan-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {!loading && error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && teams.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-slate-400"
                fill="none" viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="mt-4 text-sm text-slate-500">Nenhum time encontrado.</p>
          </div>
        )}

        {!loading && !error && teams.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onClick={() => setAddingMembersTeam(team)}
                />
            ))}
          </div>
        )}
      </main>

      {isNewTeamOpen && (
        <NewTeamCard
          onClose={() => setIsNewTeamOpen(false)}
          onCreated={load}
          createTeam={createTeam}
        />
      )}

      {addingMembersTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Membros da equipe</h2>
                <p className="text-sm text-slate-400">Equipe: {addingMembersTeam.name}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddMemberOpen(false);
                  setAddingMembersTeam(null);
                }}
                className="text-slate-400 transition hover:text-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(true)}
                className="rounded-md bg-cyan-500 px-3 py-2 text-xs font-medium text-slate-950 transition hover:bg-cyan-400"
              >
                Adicionar novos membros
              </button>
            </div>

            {membersLoading && (
              <p className="mb-3 text-sm text-slate-400">Carregando membros...</p>
            )}

            {membersError && (
              <p className="mb-3 text-sm text-red-400">{membersError}</p>
            )}

            {!membersLoading && !membersError && teamMembers.length === 0 && (
              <p className="mb-3 text-sm text-slate-500">Esse time ainda não possui membros.</p>
            )}

            {!membersLoading && teamMembers.length > 0 && (
              <ul className="divide-y divide-slate-800 rounded-md border border-slate-700 bg-slate-800/60">
                {teamMembers.map((member) => (
                  <li key={member.id} className="flex items-center justify-between px-3 py-2">
                    <div>
                      <p className="text-sm text-slate-100">{member.name}</p>
                      <p className="text-xs text-slate-400">{member.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="rounded-md p-1 text-red-400 transition hover:bg-slate-700 hover:text-red-300"
                      aria-label={`Remover ${member.name} da equipe`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {isAddMemberOpen && (
              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-900 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-100">Adicionar membros</p>
                  <button
                    type="button"
                    onClick={() => setIsAddMemberOpen(false)}
                    className="text-xs text-slate-400 transition hover:text-slate-200"
                  >
                    Fechar
                  </button>
                </div>

                {employeesError && (
                  <p className="mb-3 text-sm text-red-400">{employeesError}</p>
                )}

                <AddMember
                  teamId={addingMembersTeam.id}
                  employees={employees}
                  memberIds={teamMembers.map((member) => member.id)}
                  onMembersAdded={async () => {
                    load();
                    const result = await fetchTeamMembers(addingMembersTeam.id);
                    setTeamMembers(Array.isArray(result.data) ? result.data : []);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
