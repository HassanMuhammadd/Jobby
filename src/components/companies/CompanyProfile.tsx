import {Company} from "../../types/types";

interface props{
	company:Company,
}

export default function CompanyProfile(props:props) {
	const {company} = props;
	return (
	<div className="containerShadow w-full lg:w-3/4 bg-stone-100 p-6 rounded-md">
		<h3 className='text-2xl text-center text-emerald-700 font-bold mb-8'>Company Profile</h3>
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
		<h5 className='text-md opacity-75'>Location: {company.location}</h5>
		<h5 className='text-md opacity-75'>Industry: {company.industry}</h5>
		<h5 className='text-md opacity-75'>Founded in: {company.foundation_year}</h5>
	</div>
		<h5 className='text-sm opacity-75'>{company.description}</h5>
	</div>
	);
}