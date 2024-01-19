import EmployeeData from './EmployeeData'
import {useAuth} from '../../contexts/AuthContext'
import { IoNewspaperOutline } from "react-icons/io5";
import EditEmployee from './EditEmployee';
import {useQuery} from '@tanstack/react-query';
import {getEmployeeApplications} from '../../supabase/applicationAPI';
import EmployeeApplication from '../applications/EmployeeApplication';
import {Application} from '../../types/types';

export default function EmployeePersonalProfile() {
	const {employee} = useAuth();
	const {data: applications, isLoading} = useQuery({
		queryKey: ['applications'],
		queryFn: getEmployeeApplications.bind(null, Number(employee.id)),
	});
	if(isLoading)
	return null;

	console.log(applications);
		return (
		<div className=' min-h-[calc(100vh-107px)] p-16 bg-stone-100 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-0 justify-between'>
			<section className="flex flex-col items-center basis-1/3 w-full">
				<EmployeeData employee={employee}/>
				<h2 className='text-xl mt-8 mb-4'>Job Applications</h2>
				{applications?.map((application: Application,i) => <EmployeeApplication key={i} application={application}  />)}
			</section>
			<section className='w-full md:w-1/3 basis-1/4'>
				<div className='text-md mb-2 opacity-75 flex flex-row gap-2 items-center'><IoNewspaperOutline size={12} /> Your Resume</div>
				<div>
					{employee.resume ?
						<embed src={employee.resume}  width="100%" height='600px'/>:
						<h4 className='text-xl'>No Resume Uploaded</h4>
					}
				</div>
			</section>
			<section className='w-full md:w-1/3 basis-1/3'>
				<h4 className='text-md mb-2 opacity-75' >Edit Profile</h4>
				<EditEmployee employee={employee}/>
			</section>
		</div>
	)
}
