import React, {useEffect, useState} from 'react'
import {NavLink, useParams} from 'react-router-dom'
import CompanyProfile from './CompanyProfile';
import CompanyVacancies from './CompanyVacancies';
import {getCompanyByID} from '../../supabase/companyAPI';
import {Company} from '../../types/types';
import CompanyData from './CompanyData';

export default function CompanyPage() {
	const {id} = useParams();
	const [tab,setTab] = useState(1);
	const [company,setCompany] = useState<Company>({});

	useEffect(()=>{
		async function getCompany(){
			const company = await getCompanyByID(Number(id));
			setCompany(company);
		}
		getCompany();
	},[id]);

	return (
		<>
		<div className='p-16 pb-0 md:p-32 md:pb-0 bg-stone-100'>
			<CompanyData company={company}/>
			<div className="flex flex-row gap-4 mt-8 tabs">
				<span onClick={()=>setTab(1)} className={`px-3 py-2 rounded-t-md  hover:bg-stone-300  cursor-pointer bg-emerald-700 hover:text-black text-white transition-all duration-100 ${tab===1 && 'active'}`}>Profile</span>
				<span onClick={()=>setTab(2)} className={`px-3 py-2 rounded-t-md  hover:bg-stone-300  cursor-pointer bg-emerald-700 hover:text-black text-white transition-all duration-100 ${tab===2 && 'active'}`}>Vacancies</span>
			</div>

		</div>

		<div className="flex flex-col sm:flex-row p-8 md:p-32 pt-16 md:pt-8 gap-6">

				{tab===1?<CompanyProfile company={company}/>:<CompanyVacancies/>}

				<div className="containerShadow flex-grow bg-stone-100 p-6 rounded-md h-fit">
					<h2 className='text-center text-emerald-700 font-bold text-xl mb-5'>Want to get Hired?</h2>
					<p className='text-sm opacity-75 '>Discover hundreds of jobs that match your qualifications and start working now!</p>
					<div className='w-full  flex justify-center'>
						<NavLink to='/jobs' className={`text-center border-black border-2 px-4 py-2 rounded-full hover:bg-black  hover:text-white transition-all duration-200 mt-4  `}>Find Jobs</NavLink>

					</div>

				</div>

		</div>
		</>

	)
}

