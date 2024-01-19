import React, {useEffect, useState} from 'react'
import {Application, Employee} from '../../types/types'
import {getEmployeeByID} from '../../supabase/employeeAPI'
import { FcCancel } from "react-icons/fc";
import { GiConfirmed } from "react-icons/gi";
import {updateApplication} from '../../supabase/applicationAPI';
import {useQueryClient} from '@tanstack/react-query';
import {updateJobEmployee} from '../../supabase/jobAPI';
import {addCompanyEmployee} from '../../supabase/companyAPI';
import {useAuth} from '../../contexts/AuthContext';

export default function ApplicantCard({application}: {application: Application}) {
	const [employee,setEmployee] = useState<Employee>({});
	const [status,setStatus] = useState(application.status);
	const [confirming,setConfirming] = useState(false);
	const {company} = useAuth();
	const client = useQueryClient();

	useEffect(()=>{
		async function fetchEmployee(){
			const employee = await getEmployeeByID(Number(application.employee_id));
			setEmployee(employee);
		}
		fetchEmployee();
	},[application]);

	async function handleConfirmation(){
		await updateApplication(application,status as string);
		client.invalidateQueries({queryKey: ['applications','companies']});
		if(status==='accepted')
		{
			//update job's assigned employee
			updateJobEmployee(Number(application.job_id),Number(employee.id));
			addCompanyEmployee(Number(company.id),Number(employee.id));
		}
		setConfirming(false);
	}

	return (
	<div className="w-full px-4 py-6 bg-white rounded-lg shadow-md h-full flex flex-row justify-between items-center border-4 border-emerald-700">
		<section className='w-full'>
			<h3 className="text-xl font-semibold mb-2 uppercase">{employee.name}</h3>
			<h3 className="text-lg mb-2">Industry: {employee.industry}</h3>
			<h3 className="text-md mb-2">Location: {employee.location}</h3>
			<a href={employee.resume} target='_blank' rel='noreferrer' className="text-emerald-700 text-md font-bold mb-2 block hover:underline">View Resume</a>
			<p className="text-gray-700 text-sm opacity-75">Applied on: {application.created_at.toString().slice(0,10)}</p>
			<h3 className="text-gray-700 text-sm opacity-75">Email: {employee.email}</h3>
			<p className="text-gray-700 font-extrabold mt-2 text-sm opacity-75">Status: {application.status}</p>
		</section>

			{!confirming?
				status === 'pending' ?
				<>
				<div className='flex flex-col sm:flex-row gap-4' onClick={()=>setConfirming(true)}>
					<div className='flex flex-row items-center text-emerald-700 cursor-pointer hover:underline' onClick={()=>setStatus('accepted')}>
						<GiConfirmed size={42} className='me-1'/>
						<span>Accept</span>
					</div>
					<div className='flex flex-row items-center text-red-600 cursor-pointer hover:underline' onClick={()=>setStatus('rejected')}>
						<FcCancel size={50} />
						<span>Reject</span>
					</div>
				</div>
				</>
				: <h2 className='text-end '>You already {status} this Applicant</h2>
			:
			<div className='flex flex-col items-center'>
				<button className=' border-black border-2 px-4 py-2 rounded-full hover:bg-emerald-700 hover:border-emerald-700 hover:text-white transition-all duration-200 mb-3' onClick={handleConfirmation}>Do you want to Confirm Your Descision?</button>
				<button className='w-16 bg-red-600 text-white rounded-full py-1' onClick={()=>setConfirming(false)}>X</button>
			</div>
			}
	</div>
	)
}
