import { apiFetch } from "../lib/apiFetch";

export async function fetchTeams(params = {}) {
    const query = new URLSearchParams();

    if (params.search) query.set("search", params.search)
    if (params.page) query.set("page", String(params.page))
    if (params.pageSize) query.set("pageSize", String(params.pageSize))
    
    const response = await apiFetch(`/teams?${query.toString()}`);

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Erro ao buscar equipes.");
    }
    return result;
}

export async function createTeam(payload) {
    const response = await apiFetch("/teams", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Erro ao criar equipe.");
    }

    return result;
}

export async function addEmployeeToTeam(teamId, employeeId) {
    const response = await apiFetch(`/teams/${teamId}/members`, {
        method: "POST",
        body: JSON.stringify({ employeeId }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Erro ao adicionar funcionário à equipe.");
    }

    return result;
}

export async function fetchTeamMembers(teamId) {
    const response = await apiFetch(`/teams/${teamId}/members`);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Erro ao buscar membros da equipe.");
    }

    return result;
}

export async function removeEmployeeToTeam(teamId,employeeId){
    const response = await apiFetch(`/teams/${teamId}/members`, {
        method: "DELETE",
        body: JSON.stringify({ employeeId }),
    });

    if (response.status === 204) {
        return { success: true };
    }

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Erro ao remover funcionário da equipe.");
    }
    return result;
}

export async function updateTeam(teamId, payload) {
    const response = await apiFetch(`/teams/${teamId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Erro ao atualizar equipe.");
    }

    return result;
}

export async function fetchEmployeesForTeams(params = {}) {
    const query = new URLSearchParams();

    if (params.page) query.set("page", String(params.page));
    if (params.pageSize) query.set("pageSize", String(params.pageSize));

    const response = await apiFetch(`/employees?${query.toString()}`);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Erro ao buscar funcionários.");
    }

    return result;
}