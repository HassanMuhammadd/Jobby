import React from 'react'
import {useAuth} from '../../contexts/AuthContext';

export default function CVForm({jobId}: {jobId: string | undefined}) {
	const {employee} = useAuth();
	function handleCVSubmission(e: React.FormEvent<HTMLFormElement>){
		e.preventDefault();
		if(jobId && employee)
		{

		}
	}
  return (
	<form className='flex flex-col justify-center items-center pt-8 pb-16 gap-4' onSubmit={(e)=>handleCVSubmission(e)}>
				<label className='text-lg cursor-pointer opacity-75' htmlFor='cv' >Upload your CV Now!</label>
				<input type='file' id='cv' accept='.pdf, .docx' className='custom-file'/>
				<button type='submit' className='border-black border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200 mb-3'>Apply</button>
				<button type='submit' className='border-black border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200 '>Apply with my Current CV</button>
			</form>
  )
}
