import EmployeeMini from './EmployeeMini';
import {Employee as Emp} from '../../types/types';
import {useEmployees} from '../../contexts/EmployeesContext';
import EmployeeData from './EmployeeData';

export default function Employee({employee}: {employee: Emp}) {

	const {activeEmp,setActiveEmp} = useEmployees();

	function handleActiveEmp(){
		if(activeEmp === employee.id){
			setActiveEmp(-1);
		}else{
			setActiveEmp(employee.id);
		}
	}

  return (
	<div onClick={handleActiveEmp} className='containerShadow rounded-md border-2 flex flex-col md:flex-row gap-6 border-emerald-800 px-4 py-8 bg-white mb-4 cursor-pointer listing'>

		{activeEmp === employee.id && <EmployeeMini employee={employee}/>}

		<EmployeeData employee={employee}/>
	</div>
  )
}

