import {useEffect, useState} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {formatNumber} from '../../helpers/helpers'
import {Job} from '../../types/types';
import {getCompanyByID} from '../../supabase/companyAPI';
import {useAuth} from '../../contexts/AuthContext';

export default function JobListing({job} : {job:Job}) {
	const navigate = useNavigate();
	const [companyName,setCompanyName] = useState("");
	const {isAuthenticated} = useAuth();
	const url = useLocation().pathname;

	useEffect(()=>{
		async function getCompanyName(){
			const company = await getCompanyByID(Number(job.company_id));
			setCompanyName(company.name);
		}
		getCompanyName();
	},[job])

	function handleButtonClick(){
		if(isAuthenticated !==1)
			navigate(`/jobs/${job.id}`)
		else
			navigate(`/jobs/${job.id}/view`)
	}

	return (
		<div className='containerShadow rounded-md border-2 border-emerald-800 p-4 bg-white mb-4 listing'>

			<h2 className='font-bold text-xl '>{job.name}</h2>
		<Link to={`/companies/${Number(job.company_id)}`} className='mb-3 hover:text-emerald-800 hover:underline'>{companyName}</Link>
		<p className='text-sm opacity-75 my-2'>{job.description}</p>

		<div className="flex flex-row justify-between items-center mt-5	">
			<span className=' rounded-full text-sm bg-stone-200 p-3'>{formatNumber(Number(job.salary))}</span>
			<button onClick={handleButtonClick} className='border-black text-xs md:text-base  border-2 px-2 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-150 '>{isAuthenticated===1 && url.includes('/profile/')? 'View Applicants' : 'Apply Now'}</button>
		</div>
	</div>
)
}
