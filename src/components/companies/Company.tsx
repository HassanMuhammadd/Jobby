import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Company as companyType} from '../../types/types';
import CompanyData from './CompanyData';

interface props{
	company:companyType,
}

export default function Company(props:props) {
	const {company} = props;
	const navigate = useNavigate();
	return (
		<div className='containerShadow rounded-md border-2 flex flex-col sm:flex-row gap-6 border-emerald-800 px-4 py-8 bg-white mb-4 cursor-pointer listing'
			onClick={() => {
				navigate(`/companies/${company.id}`)
			}}
		>
			<CompanyData company={company}/>
		</div>
	)

}
