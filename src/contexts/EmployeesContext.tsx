import React, {createContext, useContext, useState} from 'react'
import {getEmployees} from '../supabase/employeeAPI';
import {useQuery} from '@tanstack/react-query';
import {Employee as Emp} from '../types/types';
import Employee from '../components/employees/Employee';

interface employeesContextType  {
	employees: Emp[] | undefined,
	isLoading: boolean,
	activeEmp: Number,
	setActiveEmp: Function,
	displayEmployees: Function
}

const EmployeesContext = createContext<employeesContextType|undefined>(undefined)

export default function EmployeesProvider({children}: {children: React.ReactNode}) {

	const [activeEmp,setActiveEmp] = useState<Number>(-1);

	const {data: employees, isLoading} = useQuery({
		queryKey: ['employees'],
		queryFn: getEmployees,
	})

	function displayEmployees(limit: number){
		const employeeComponents = employees?.map((employee: Emp) => <Employee key={employee.id} employee={employee} />);
		return employeeComponents?.slice(0,limit);
	}

	return (
	<EmployeesContext.Provider value={{
		employees,
		isLoading,
		activeEmp,
		setActiveEmp,
		displayEmployees,
	}}>
		{children}
	</EmployeesContext.Provider>
	)
}

export function useEmployees(){
	const employees = useContext(EmployeesContext);
	if(employees === undefined){
		throw new Error('useEmployees must be used within an EmployeesProvider')
	}
	return employees
}