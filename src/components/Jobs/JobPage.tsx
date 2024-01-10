import React,{useEffect,useState} from 'react'
import {Link,useParams} from 'react-router-dom'
import {formatNumber} from '../../helpers/helpers';
import {Company,Job} from '../../types/types';
import {getJobByID} from '../../supabase/jobAPI';
import {getCompanyByID} from '../../supabase/companyAPI';
import {useAuth} from '../../contexts/AuthContext';
import CVForm from './CVForm';

export default function JobPage() {
	const {jobId}=useParams();
	const [job,setJob]=useState<Job>({} as Job);
	const [company,setCompany]=useState<Company>({} as Company);
	const {isAuthenticated}=useAuth();

	useEffect(() => {
		async function getJob() {
			const job=await getJobByID(Number(jobId));
			setJob(job);
		}
		getJob();
	},[jobId])

	useEffect(() => {
		async function getCompanyName() {
			const company=await getCompanyByID(Number(job.company_id));
			setCompany(company);
		}

		if(job&&job.company_id) {getCompanyName()}
	},[job])



	return (
		<>
			<div className='p-16 pb-16 md:p-32 md:pb-16 bg-stone-100'>
				<h2 className='font-bold text-3xl uppercase mb-4'>{job.name}</h2>
				<Link to={`/companies/${company.id}`} className='mb-3 hover:text-emerald-800 hover:underline text-lg'>{company.name}</Link>
				<p className='text-sm mt-2 mb-4'>Salary: {formatNumber(Number(job.salary))}</p>
				<p className='text-sm opacity-75 my-4'>Description: {job.description}</p>
				<p className='text-sm opacity-75 my-2'>Experience: {job.experience}</p>
				<p className='text-sm opacity-75 my-2'>Industry: {job.industry}</p>
				<p className='text-sm opacity-75 my-2'>Job type: {job.type}</p>
			</div>
			{isAuthenticated?<CVForm jobId={jobId} />:<h4 className='my-6 text-center text-xl'>Login to apply to this job</h4>}

		</>
	)
}
