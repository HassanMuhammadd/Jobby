import React, {useEffect, useState} from 'react'
import {useAuth} from '../../contexts/AuthContext';
import {addApplication, checkOldApplication, getEmployeeApplication} from '../../supabase/applicationAPI';
import toast from 'react-hot-toast';
import {useQuery} from '@tanstack/react-query';

export default function CVForm({jobId}: {jobId: string | undefined}) {
	const {employee} = useAuth();
	const [resume,setResume] = useState<any>();
	const [appliedBefore, setAppliedBefore] = useState(false);

	const handleResume = (e: React.ChangeEvent<HTMLInputElement> | any): void => {
		const files = Array.from(e.target.files)
		setResume(files[0]);
	}

	useEffect(()=>{
		async function checkPresence(){
			const res = await checkOldApplication(Number(jobId), employee);
			setAppliedBefore(res);
		}
		checkPresence();
	},)
	const {data: application, isLoading } = useQuery({
		queryKey: ['applications'],
		queryFn: getEmployeeApplication.bind(null, Number(employee.id), Number(jobId)),
	})
	if(isLoading)
		return null;
	if(appliedBefore)
	{
		return (
			<div className='text-xl text-center my-4  '>
				You have already applied to this job!<br/>
				Status: {application?.status}
			</div>
		)
	}

	async function handleCVSubmission(){
		if(jobId && employee)
		{
			const res = await addApplication(Number(jobId), employee);
			if(res)
				toast.success("Successfully Applied!");
		}
	}
	async function handleOldCVSubmission(){
		if(jobId && employee)
		{
			const res = await addApplication(Number(jobId), employee, resume);
			if(res)
				toast.success("Successfully Applied!");
		}
	}
  return (
	<div className='flex flex-col justify-center items-center pt-8 pb-16 gap-4' >
		<label className='text-lg cursor-pointer opacity-75' htmlFor='cv'>Upload your CV Now!</label>
		<input type='file' id='cv' accept='.pdf, .docx' className='custom-file' onChange={(e)=>handleResume(e)}/>
		<button type='submit' onClick={()=>handleOldCVSubmission()} className='border-black border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200 mb-4'>Upload a new CV and Apply</button>
		<button type='submit' onClick={()=>handleCVSubmission()} className='border-black border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200 '>Apply with my Current CV</button>
	</div>
  )
}
