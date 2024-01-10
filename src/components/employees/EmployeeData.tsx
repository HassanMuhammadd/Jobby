import {Employee} from "../../types/types";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { BsPersonWorkspace } from "react-icons/bs";

export default function EmployeeData({employee}: {employee: Employee}) {
    return (
	<>
		<img src={employee.image} className='p-1 bg-emerald-700 w-32 h-32' alt='Employee Profile' />
		<div>
			<h1 className='text-2xl font-bold uppercase tracking-normal mb-2'>{employee.name}</h1>
			<div className='text-sm opacity-75 flex flex-row gap-2 items-center'><BsPersonWorkspace size={12} /> {employee.industry}</div>
			<div className='text-sm opacity-75 flex flex-row gap-2 items-center'><FaPhoneAlt size={12} /> {employee.phone}</div>
			<h4 className='text-sm opacity-75  flex flex-row gap-2 items-center'><MdEmail size={12}/> {employee.email}</h4>
			<h4 className='text-sm opacity-75  flex flex-row gap-2 items-center'><FaLocationDot size={12}/> {employee.location}</h4>
		</div>
	</>
	);
}
