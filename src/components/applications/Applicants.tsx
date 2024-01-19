import React, {} from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import {getApplications} from '../../supabase/applicationAPI';
import {Application} from '../../types/types';
import ApplicantCard from './ApplicantCard';
import {useQuery} from '@tanstack/react-query';


export default function Applicants() {
	const navigate = useNavigate();
	const {jobId}=useParams();
	const {isAuthenticated} = useAuth();

	const {data: applications} = useQuery({
		queryKey: ['applications'],
		queryFn: getApplications.bind(null, Number(jobId)),
	})

	if(isAuthenticated !== 1)
	{
		navigate(`/jobs/`);
	}
	return (
	<div className='bg-stone-100 flex flex-col lg:flex-row p-8 sm:p-16 gap-8 min-h-screen'>
		{
			applications?.length===0?<h1 className='text-2xl w-full text-center'>No Applicants yet</h1>:
			applications?.map((app: Application) => <ApplicantCard application={app} key={app.id} />)
		}
	</div>
)
}
