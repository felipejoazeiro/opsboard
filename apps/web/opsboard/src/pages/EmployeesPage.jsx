import React, { useEffect } from "react";
import { useEmployee } from "../hooks/useEmployee";
import { SideBar } from "../components/Shared/SideBar";
import { Header } from "../components/Employee/Header";
import { SearchInput } from "../components/Employee/SearchInput";
import { EmployeeCard } from "../components/Employee/EmployeeCard";
import { NewEmployeeCard } from "../components/Employee/NewEmployeeCard";
import { UpdateEmployee } from "../components/Employee/UpdateEmployee";
import { EmptyState } from "../components/Shared/EmptyState";
import { ErrorState } from "../components/Shared/ErrorState";

export function EmployeesPage() {
  const {
    employees,
    loading,
    error,
    isAddEmployeeOpen,
    setIsAddEmployeeOpen,
    search,
    setSearch,
    isNewEmployeeOpen,
    setIsNewEmployeeOpen,
    editingEmployee,
    setEditingEmployee,
  } = useEmployee();

  async function handleUpdateEmployee(employeeId, payload) {
    await updateEmployee(employeeId, payload);
    await load();
    setEditingEmployee(null);
  }

  async function handleCreateEmployee(payload) {
    await createEmployee(payload);
    await load();
    setIsNewEmployeeOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <SideBar />
      <main className="flex-1 px-6 py-8 md:px-10">
        <Header setIsNewEmployeeOpen={setIsNewEmployeeOpen} />
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
        {!loading && !error && employees.length === 0 && <EmptyState />}
        {!loading &&
          !error &&
          employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={() => setEditingEmployee(employee)}
            />
          ))}
        {isNewEmployeeOpen && (
          <NewEmployeeCard
            onCreate={handleCreateEmployee}
            onClose={() => setIsNewEmployeeOpen(false)}
          />
        )}
        {editingEmployee && (
          <UpdateEmployee
            employee={editingEmployee}
            onUpdate={handleUpdateEmployee}
            onClose={() => setEditingEmployee(null)}
          />
        )}
      </main>
    </div>
  );
}
