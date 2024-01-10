import JobListing from '../Jobs/JobListing'
import {useLocation, useParams} from 'react-router-dom'
import {useQuery} from '@tanstack/react-query';
import {Job} from '../../types/types';
import {getJobsByCompany} from '../../supabase/jobAPI';

export default function CompanyVacancies() {
	const {id} = useParams();
	const url = useLocation().pathname;
	const {data:jobs,isLoading} = useQuery({
		queryKey: ['jobs', id],
		queryFn: getJobsByCompany.bind(null, Number(id)),
	})
	return (
		<div className={`containerShadow w-full ${url.includes('companies') ? 'lg:w-3/4 bg-stone-100':'bg-stone-200 border-2 border-emerald-700'}  p-6 rounded-md`}>
			<h3 className='text-2xl text-center text-emerald-700 font-bold mb-8'>Company Vacancies</h3>
			{
				isLoading ? <div className='text-center text-xl my-6'>Loading...</div> :
				jobs && jobs.length?
				jobs.map((job:Job) => <JobListing key={job.id} job={job} />) :
				<div className='text-center text-xl my-6'>No Vacancies Available at the moment.</div>
			}
		</div>
	)
}
