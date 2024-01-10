import {Employee} from '../../types/types'


export default function EmployeeMini({employee}: {employee: Employee}) {
  return (
	<div className='fixed containerShadow w-full overflow-y-scroll  h-1/4  bottom-0 left-0 z-10 bg-stone-300 opacity-[0.97] px-16 py-6'>
		<h1 className='text-2xl font-bold uppercase tracking-normal mb-2'>{employee.name}</h1>
			<h4 className='text-sm opacity-75'>{employee.industry}</h4>
			<h4 className='text-sm opacity-75 mb-2'>{employee.location}</h4>
			<h4 className='text-sm opacity-75 mb-2'>Contact Email: {employee.email}</h4>
			<h4 className='text-sm opacity-75 '>Contact Phone: {employee.phone}</h4>
	</div>
  )
}
