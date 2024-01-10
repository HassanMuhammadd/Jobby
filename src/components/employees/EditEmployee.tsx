import React, {useEffect, useState} from 'react'
import {Employee} from '../../types/types'
import Input from '../UI/Input'
import {updateEmployee} from '../../supabase/employeeAPI';
import {useNavigate} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';


export default function EditEmployee({employee}: {employee: Employee}) {
	const [name,setName] = useState(employee.name);
	const [email, setEmail] = useState(employee.email);
	const [phone, setPhone] = useState(employee.phone);
	const [industry, setIndustry] = useState(employee.industry);
	const [location, setLocation] = useState(employee.location);
	const [image,setImage] = useState<any>('');
	const [resume,setResume] = useState<any>('');

	const queryClient = useQueryClient();

	const navigate = useNavigate();

	useEffect(()=>{

		if(! (employee && employee.id))
		{
			navigate('/');
		}
	},[employee, navigate]);

	const handleImage = (e: React.ChangeEvent<HTMLInputElement> | any): void => {
		const files = Array.from(e.target.files)
		setImage(files[0]);
	}
	const handleResume = (e: React.ChangeEvent<HTMLInputElement> | any): void => {
		const files = Array.from(e.target.files)
		setResume(files[0]);
	}

	function editData(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		toast.custom(() => (
			<div
				style={{
				color: 'white',
				backgroundColor: '#50d154',
				padding: '10px',
				borderRadius: '5px',
				}}
			>
			Loading
			</div>
			))
		const updatedEmployee = {
			name,
			email,
			phone,
			industry,
			location,
			image,
			resume
		}

		if(employee.id)
		{
			updateEmployee(updatedEmployee, employee.id);
			queryClient.invalidateQueries({queryKey: ['employees']});
		}

	}

    return (
	<form className='containerShadow bg-white flex flex-col  p-8 border-2 rounded-lg border-emerald-700' onSubmit={(e)=>editData(e)}>
		<Input name="Name" type='text' value ={name} onChange={(e: string)=>setName(e)}/>
		<Input name='Email' type='email' value={email} onChange={(e:string)=>setEmail(e)}/>
		<Input name='Phone' type='text' value={phone} onChange={(e:string)=>setPhone(e)}/>
		<Input name='Industry' type='text' value={industry} onChange={(e:string)=>setIndustry(e)}/>
        <Input name='Location' type='text' value={location} onChange={(e:string)=>setLocation(e)}/>
		<div className='flex flex-col  mb-4'>
            <label htmlFor='resume' className='mb-2'>Resume</label>
        	<input type='file' accept='.pdf , .docx'  id='resume' className='border-2 border-emerald-700 custom-file' onChange={(e)=>handleResume(e)} />
        </div>
		<div className='flex flex-col  mb-4'>
            <label htmlFor='image' className='mb-2'>Image</label>
            <input type='file' accept='image/*'  id='image'  className='border-2 border-emerald-700 custom-file' onChange={(e)=>handleImage(e)} />
        </div>
		<button type="submit" className='w-28 border-black border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200 mb-3'>Edit Data</button>
	</form>
    )
}
