import { apiFetch } from '../lib/apiFetch.js'

/**
 * Busca lista de tarefas com suporte a filtros, busca e paginação.
 * @param {{ search?: string, status?: string, priority?: string, page?: number, pageSize?: number }} params
 */
export async function fetchTasks(params = {}) {
  const query = new URLSearchParams()

  if (params.search)   query.set('search', params.search)
  if (params.status)   query.set('status', params.status)
  if (params.priority) query.set('priority', params.priority)
  if (params.page)     query.set('page', String(params.page))
  if (params.pageSize) query.set('pageSize', String(params.pageSize))

  const qs = query.toString()
  const response = await apiFetch(`/tasks${qs ? `?${qs}` : ''}`)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Erro ao buscar tarefas.')
  }

  return result
}

/**
 * Cria uma nova tarefa.
 * @param {{ title: string, description?: string, status?: string, priority?: string, dueDate?: string }} payload
 */
export async function createTask(payload) {
  const response = await apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Erro ao criar tarefa.')
  }

  return result
}

export async function updateTask(taskId, payload) {
  const response = await apiFetch(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Erro ao atualizar tarefa.')
  }
  return result
}

export async function deleteTask(taskId) {
  const response = await apiFetch(`/tasks/${taskId}`, {
    method: 'DELETE',
  })
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Erro ao deletar tarefa.')
  }
  return result
}

