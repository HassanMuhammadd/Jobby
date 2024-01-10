import  {useEffect, useState} from 'react'
import FilterOptions from './FilterOptions'
import {useWindowResize} from '../../hooks/useWindowResize';
import {useCompanies} from '../../contexts/CompaniesContext';
import {useJobs} from '../../contexts/JobsContext';
import Button from '../UI/Button';

export default function Jobs() {
  const [showFilters,setShowFilters] = useState(false);
  const {handleCompanyFilter} = useCompanies();
  const screenWidth = useWindowResize(setShowFilters,1024);
  const {jobs, displayJobs,isLoading} = useJobs();

  const [limit,setLimit] = useState(10);


  useEffect(()=>{
    handleCompanyFilter('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const displayedJobs = displayJobs(limit)
  return (
	<div className='bg-stone-100 flex flex-col lg:flex-row p-16 gap-8 min-h-screen'>
    <div className="flex-none w-full lg:w-1/4">
        {screenWidth<1024 && <button onClick={()=>setShowFilters(!showFilters)}>{showFilters?'Hide':'Show'} Filters</button>}
        {showFilters && <FilterOptions/>}
    </div>
    <div className="flex-grow">
      {isLoading && <div className='text-center text-xl my-6'>Loading...</div>}
      {isLoading || displayedJobs?.length? displayedJobs : <div className='text-center text-xl my-6'>No Jobs Available With the Current Filters</div>}
      {jobs && limit < jobs.length && <Button text='Load More' onClick={()=>setLimit(limit+10)}/>}
    </div>
  </div>
  )
}
