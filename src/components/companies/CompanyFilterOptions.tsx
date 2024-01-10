import {useCompanies} from '../../contexts/CompaniesContext';
import FilterOption from '../Jobs/FilterOption'


export default function CompanyFilterOptions() {
	const {handleCompanyFilter} = useCompanies();
	const {categories} = useCompanies();
	return (
	<div className='filterOptions bg-white py-8 px-4 rounded-md '>
		<h4 className='text-center mb-6'> Filters</h4>
		<div className='flex flex-col px-8'>
			<FilterOption title="Company Category" names={categories} onChange={(e)=>handleCompanyFilter(e)} />
		</div>

	</div>
  )
}
