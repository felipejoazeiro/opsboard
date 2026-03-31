import React, { useEffect } from "react";
import { useEmployee } from "../hooks/useEmployee";
import { SideBar } from "../components/Shared/SideBar";

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
    
    useEffect(() => {
        if (!isAddEmployeeOpen && !isNewEmployeeOpen && !editingEmployee) {
            setSearch("");
        }
    }, [isAddEmployeeOpen, isNewEmployeeOpen, editingEmployee, setSearch]);

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <SideBar />
        </div>
    );

}