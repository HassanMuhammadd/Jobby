import EmployeeData from './EmployeeData'
import {useAuth} from '../../contexts/AuthContext'
import { IoNewspaperOutline } from "react-icons/io5";
import EditEmployee from './EditEmployee';

export default function EmployeePersonalProfile() {
	const {employee} = useAuth();

	return (
		<div className=' min-h-[calc(100vh-107px)] p-16 bg-stone-100 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-0 justify-between'>
			<section className="flex flex-col gap-8">
				<EmployeeData employee={employee}/>
			</section>
			<section className='w-full md:w-1/3'>
				<div className='text-md mb-2 opacity-75 flex flex-row gap-2 items-center'><IoNewspaperOutline size={12} /> Your Resume</div>
				<div>
					{employee.resume ?
						<embed src={employee.resume}  width="100%" height='600px'/>:
						<h4 className='text-xl'>No Resume Uploaded</h4>
					}
				</div>
			</section>
			<section className='w-full md:w-1/3'>
				<h4 className='text-md mb-2 opacity-75' >Edit Profile</h4>
				<EditEmployee employee={employee}/>
			</section>
		</div>
	)
}
