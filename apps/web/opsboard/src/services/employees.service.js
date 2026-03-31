import { apiFetch } from "../lib/apiFetch";

export async function fetchEmployees(params = {}) {
    const query = new URLSearchParams();

    if (params.search) query.set("search", params.search)
    if (params.page) query.set("page", String(params.page))
    if (params.pageSize) query.set("pageSize", String(params.pageSize))

    const response = await apiFetch(`/employees?${query.toString()}`);

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erro ao buscar funcionários.");
    }
    return response;
}

export async function fetchEmployeeById(id) {
    const response = await apiFetch(`/employees/${id}`);
    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erro ao buscar funcionário.");
    }
    return response;
}

export async function createEmployee(payload) {
    const response = await apiFetch("/employees", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Erro ao criar funcionário.");
    }
    return result;
}

export async function updateEmployee(id, payload) {
    const response = await apiFetch(`/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Erro ao atualizar funcionário.");
    }
    return result;
}

export async function deleteEmployee(id) {
    const response = await apiFetch(`/employees/${id}`, {
        method: "DELETE",
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Erro ao deletar funcionário.");
    }
    return result;
} 
