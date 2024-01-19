import React, {useState} from 'react'
import {Company} from '../../types/types';
import Input from '../UI/Input';
import {useCompanies} from '../../contexts/CompaniesContext';
import {createPortal} from 'react-dom';
import {addJob} from '../../supabase/jobAPI';
import toast from 'react-hot-toast';
import {useQueryClient} from '@tanstack/react-query';

export default function AddJob({company}: {company: Company}) {
	const [name,setName] = useState('');
	const [industry,setIndustry] = useState('');
	const [salary,setsalary] = useState(0);
	const [location,setlocation] = useState('');
	const [description,setdescription] = useState('');
	const [experience,setexperience] = useState('');
	const [type,settype] = useState('');
	const {setShowModal} = useCompanies();

	const queryClient = useQueryClient();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>)
	{
		e.preventDefault();
		const job = {
			name,
			industry,
			salary,
			location,
			description,
			experience,
			type,
			company_id: company.id,
			created_at: new Date(),
		}
		await addJob(job);
		setName('');
		setIndustry('');
		setsalary(0);
		setlocation('');
		setdescription('');
		setexperience('');
		settype('');
		toast.success("Job Added Successfully!")
		queryClient.invalidateQueries({queryKey: ['jobs']});
		setShowModal(false)
	}

  return (
	createPortal(
		<form onSubmit={(e)=>handleSubmit(e)} className='w-4/5 h-3/5 overflow-y-scroll boxShadow  left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] fixed z-[1000]  bg-stone-200 rounded-md p-4 '>
		<button onClick={()=>setShowModal(false)} className='bg-red-500  text-white px-2 py-1 absolute top-0 right-0'>X</button>
		<h1 className='text-xl text-center '>Add Job</h1>
		<Input name="Name" type="text" value={name} onChange={setName}/>
		<Input name="Industry" type="text" value={industry} onChange={setIndustry}/>
		<Input name="Salary" type="number" value={salary} onChange={setsalary}/>
		<Input name="Location" type="text" value={location} onChange={setlocation}/>
		<Input name="Description" type="text" value={description} onChange={setdescription}/>
		<Input name="Experience" type="text" value={experience} onChange={setexperience}/>
		<Input name="Type" type="text" value={type} onChange={settype}/>
		<button type='submit' className=' border-black border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200 mb-3' >Add Job</button>
	</form>
		,document.body)
  )
}
