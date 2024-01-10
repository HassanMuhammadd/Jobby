import React, {useEffect, useState} from 'react'
import {Company} from '../../types/types'
import Input from '../UI/Input'
import {useNavigate} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {updateCompany} from '../../supabase/companyAPI';


export default function EditCompany({company}: {company: Company}) {
	const [name,setName] = useState(company.name);
	const [email, setEmail] = useState(company.email);
	const [industry, setIndustry] = useState(company.industry);
	const [location, setLocation] = useState(company.location);
	const [image,setImage] = useState<any>('');
	const [description,setDescription] = useState(company.description);
	const [foundationYear,setFoundationYear] = useState(company.foundation_year);

	const queryClient = useQueryClient();

	const navigate = useNavigate();

	useEffect(()=>{

		if(! (company && company.id))
		{
			navigate('/');
		}
	},[company, navigate]);

	const handleImage = (e: React.ChangeEvent<HTMLInputElement> | any): void => {
		const files = Array.from(e.target.files)
		setImage(files[0]);
	}

	function editData(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if(foundationYear && foundationYear > new Date().getFullYear()){
			toast.error("Foundation year cannot be in the future")
			return;
		}
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
		const updatedCompany = {
			name,
			email,
			industry,
			location,
			image,
			description,
			foundation_year: foundationYear
		}

		if(company.id)
		{
			updateCompany(updatedCompany, company.id);
			queryClient.invalidateQueries({queryKey: ['companies']});
		}

	}

    return (
	<form className='containerShadow bg-white flex flex-col  p-8 border-2 rounded-lg border-emerald-700' onSubmit={(e)=>editData(e)}>
		<Input name="Name" type='text' value ={name} onChange={(e: string)=>setName(e)}/>
		<Input name='Email' type='email' value={email} onChange={(e:string)=>setEmail(e)}/>
		<Input name='Industry' type='text' value={industry} onChange={(e:string)=>setIndustry(e)}/>
        <Input name='Location' type='text' value={location} onChange={(e:string)=>setLocation(e)}/>
		<Input name='Description' type='text' value={description} onChange={(e:string)=>setDescription(e)}/>
		<Input name='Foundation Year' type='number' value={foundationYear} onChange={(e:number)=>setFoundationYear(e)}/>
		<div className='flex flex-col  mb-4'>
            <label htmlFor='image' className='mb-2'>Image</label>
            <input type='file' accept='image/*'  id='image'  className='border-2 border-emerald-700 custom-file' onChange={(e)=>handleImage(e)} />
        </div>
		<button type="submit" className='w-28 border-black border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200 mb-3'>Edit Data</button>
	</form>
    )
}
