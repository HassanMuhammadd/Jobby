import {useEffect, useState} from 'react'
import {useWindowResize} from '../../hooks/useWindowResize';
import CompanyFilterOptions from './CompanyFilterOptions';
import {useCompanies} from '../../contexts/CompaniesContext';
import Button from '../UI/Button';

export default function Companies() {

  const {isLoading , companies ,displayCompanies, handleCompanyFilter} = useCompanies();
  const [limit,setLimit] = useState(10);
  const [showFilters,setShowFilters] = useState<boolean>(false);
  const screenWidth = useWindowResize(setShowFilters,1024);

  useEffect(()=>{
    handleCompanyFilter('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  return (
	<div className='overflow-hidden min-h-[calc(100vh-107px)] bg-stone-100 flex flex-col lg:flex-row p-16 gap-8 '>
    <div className="flex-none w-full lg:w-1/4">
        {screenWidth<1024 && <button onClick={()=>setShowFilters(!showFilters)}>{showFilters?'Hide':'Show'} Filters</button>}
        {showFilters && <CompanyFilterOptions/>}
    </div>
    <div className="flex-1 ">
      {isLoading?
      <div className='text-center text-xl my-6'>Loading...</div>:
      displayCompanies(limit)
      }
      {companies && limit < companies.length && <Button text='Load More' onClick={()=>setLimit(limit+10)}/>}
    </div>
  </div>
  )

}
