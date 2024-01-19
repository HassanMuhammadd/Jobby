import React, {useEffect, useState} from 'react'
import {Application, Company, Job} from '../../types/types'
import {useQuery} from '@tanstack/react-query';
import {getAllJobs} from '../../supabase/jobAPI';
import {getCompanyByID} from '../../supabase/companyAPI';
import {Link} from 'react-router-dom';

//TODO: GET COMPANY DATA FROM JOB ID
export default function EmployeeApplication({application}: {application: Application}) {
	const [companyId,setCompanyId] = useState(0);
	const [company,setCompany] = useState<Company>({});

	const {data: allJobs, isLoading} = useQuery({
		queryKey: ['jobs'],
		queryFn: getAllJobs,
	})
	useEffect(()=>{
		allJobs?.forEach((job:Job)=>{
			if(job.id ===application.job_id){
				setCompanyId(Number(job.company_id));
				return;
			}
		})
	},[allJobs, application]);

	useEffect(()=>{
		async function getCompany(){

			if(isLoading)
				return;

			const company = await getCompanyByID(companyId);
			setCompany(company);
		}
		getCompany();
	},[isLoading,companyId]);

	if(!company)
		return <h1>No Applications Found</h1>;
  return (
	<div className="w-full px-4 py-6 bg-white rounded-lg shadow-md h-full flex flex-row justify-between items-center border-4 border-emerald-700">
		<section className="w-full">
			<h3 className="text-xl font-semibold mb-2 uppercase">Company: {company.name}</h3>
			<h3 className="text-lg mb-2">Industry: {company.industry}</h3>
			<h3 className="text-md mb-2">Location: {company.location}</h3>
			<Link to={`/companies/${company.id}`} className="text-emerald-700 text-md font-bold mb-2 block hover:underline">View Company</Link>
			<h3 className="text-gray-700 text-sm opacity-75">Applied on: {application.created_at.toString().slice(0,10)}</h3>
			<h3 className="text-gray-700 text-md capitalize mt-4">Status: <span className={`${application.status === 'rejected' ? 'text-red-500' : 'text-emerald-700'}`}>{application.status}</span></h3>
		</section>
	</div>
  )
}
