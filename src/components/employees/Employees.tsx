import {useState} from 'react'
import {useEmployees} from '../../contexts/EmployeesContext'
import Button from '../UI/Button';

export default function Employees() {

  const {employees, isLoading, displayEmployees } = useEmployees();
  const [limit,setLimit] = useState(20);

  if(isLoading)
    <div className='grid grid-cols-1 lg:grid-cols-2  gap-8 p-16 bg-stone-100 '>
      Loading employees data...
    </div>
  return (
  <div className='min-h-[calc(100vh-107px)] bg-stone-100'>
	<div className=' grid grid-cols-1 lg:grid-cols-2  gap-8 p-16 '>
    {employees && displayEmployees(limit)}
    {employees && limit < employees.length && <Button text='Load More' onClick={()=>setLimit(limit+10)}/>}
  </div>
  </div>
  )
}
