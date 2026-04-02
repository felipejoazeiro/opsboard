import { useState } from "react";
import { useEmployee } from "../hooks/useEmployee";
import { SideBar } from "../components/Shared/SideBar";
import { Header } from "../components/Employee/Header";
import { SearchInput } from "../components/Employee/SearchInput";
import { EmployeeCard } from "../components/Employee/EmployeeCard";
import { NewEmployeeCard } from "../components/Employee/NewEmployeeCard";
import { NewRoleCard } from "../components/Employee/NewRoleCard";
import { UpdateEmployee } from "../components/Employee/UpdateEmployee";
import { EmployeeDetailsCard } from "../components/Employee/EmployeeDetailsCard";
import { EmptyState } from "../components/Employee/EmptyState";
import { ErrorState } from "../components/Employee/ErrorState";
import {
  createEmployee,
  createRole,
  fetchEmployeeById,
  updateEmployee,
} from "../services/employees.service";

export function EmployeesPage() {
  const {
    employees,
    loading,
    error,
    load,
    search,
    setSearch,
    isNewEmployeeOpen,
    setIsNewEmployeeOpen,
    isNewRoleOpen,
    setIsNewRoleOpen,
    roles,
    loadRoles,
    editingEmployee,
    setEditingEmployee,
  } = useEmployee();

  const employeeList = Array.isArray(employees) ? employees : [];
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  async function handleOpenEmployeeDetails(employeeId) {
    setIsDetailsOpen(true);
    setDetailsLoading(true);
    setDetailsError(null);
    setSelectedEmployee(null);
    setIsNewRoleOpen(false);

    try {
      const employee = await fetchEmployeeById(employeeId);
      setSelectedEmployee(employee);
    } catch (err) {
      setDetailsError(err.message || "Erro ao buscar detalhes do funcionário.");
    } finally {
      setDetailsLoading(false);
    }
  }

  async function handleUpdateEmployee(employeeId, payload) {
    await updateEmployee(employeeId, payload);
    await load();
    setEditingEmployee(null);
    setIsNewRoleOpen(false);
  }

  async function handleCreateEmployee(payload) {
    await createEmployee(payload);
    await load();
    setIsNewEmployeeOpen(false);
    setIsNewRoleOpen(false);
  }

  async function handleCreateRole(payload) {
    await createRole(payload);
    await loadRoles();
    setIsNewRoleOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <SideBar />
      <main className="flex-1 px-6 py-8 md:px-10">
        <Header setIsNewEmployeeOpen={setIsNewEmployeeOpen} setIsNewRoleOpen={setIsNewRoleOpen} />
        <SearchInput value={search} onChange={setSearch} />

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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && employeeList.length === 0 && <EmptyState />}
        {!loading &&
          !error &&
          employeeList.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onClick={() => handleOpenEmployeeDetails(employee.id)}
              onEdit={() => setEditingEmployee(employee)}
            />
          ))}
        {isNewEmployeeOpen && (
          <NewEmployeeCard
            onCreate={handleCreateEmployee}
            roles={roles}
            onClose={() => setIsNewEmployeeOpen(false)}
          />
        )}
        {isNewRoleOpen && (
          <NewRoleCard
            onCreate={handleCreateRole}
            onClose={() => setIsNewRoleOpen(false)}
          />
        )}
        {editingEmployee && (
          <UpdateEmployee
            employee={editingEmployee}
            onUpdate={handleUpdateEmployee}
            onClose={() => setEditingEmployee(null)}
          />
        )}
        {isDetailsOpen && (
          <EmployeeDetailsCard
            employee={selectedEmployee}
            loading={detailsLoading}
            error={detailsError}
            onClose={() => {
              setIsDetailsOpen(false);
              setSelectedEmployee(null);
              setDetailsError(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
