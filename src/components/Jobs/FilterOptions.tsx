import FilterOption from './FilterOption'
import {formatNumber, handleInputChange} from '../../helpers/helpers';
import {useCompanies} from '../../contexts/CompaniesContext';
import {useJobs} from '../../contexts/JobsContext';
import {useLocation} from 'react-router-dom';



export default function FilterOptions() {
	const {locations,
		experiences,
		types: jobTypes,
		handleJobFilter,
		salaryFilter,
		setSalaryFilter,
		categories: jobCategories} = useJobs()
	const url = useLocation().pathname;

	const {categories: companyCategories, handleCompanyFilter} = useCompanies();
	return (
	<div className='filterOptions bg-white py-8 px-4 rounded-md '>
		<h4 className='text-center mb-6'> Filters</h4>
		<div className='flex flex-col px-8'>
			<FilterOption title="Location" names={locations} onChange={(e)=>handleJobFilter(e, 'location')} />
			<FilterOption title="Experience" names={experiences} onChange={(e)=>handleJobFilter(e, 'experience')} />
			{url==='/jobs'?
			<FilterOption title="Job Category" names={jobCategories} onChange={(e)=>handleJobFilter(e, 'category')} />:
			<FilterOption title="Company Category" names={companyCategories} onChange={(e)=>handleCompanyFilter(e)} />
			}
			<FilterOption title="Job Type" names={jobTypes} onChange={(e)=>handleJobFilter(e, 'type')} />

			<label className='mt-4 mb-2 ps-3'>Max Salary</label>
			<input
			type='range'
			min='0'
			max='150000'
			value={salaryFilter}
			onChange={(e)=>{
				setSalaryFilter(e.target.value);
				handleInputChange(e)}
			}/>

			<span className='text-xs mt-2'>{formatNumber(Number(salaryFilter))}</span>
		</div>

	</div>
  )
}
