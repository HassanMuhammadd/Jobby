import toast from "react-hot-toast";
import {Employee} from "../types/types";
import supabase, {supabaseUrl} from "./supabase";
const bcrypt = require('bcryptjs');

export async function getEmployeeByID(queryID: number){

	let { data: employee} = await supabase
	.from('employee')
	.select('*')
	.eq('id', queryID).single();

	return employee;
}

export async function getEmployees() {

	let { data: employees} = await supabase
	.from('employee')
	.select('*');
	return employees as Employee[];
}



export async function addEmployee(employee:Employee)
{
	const imgName = `employee_${employee.name}-${Date.now()}`;
	const resumeName = `employee_${employee.name}_CV-${Date.now()}`;
	const imagePath = `${supabaseUrl}/storage/v1/object/public/employee-images/${imgName}`
	const resumePath = `${supabaseUrl}/storage/v1/object/public/employee-resumes/${resumeName}`

	employee.password = bcrypt.hashSync(employee.password, 10);
	const data = await supabase.from("employee").insert([{...employee, image : imagePath, resume: resumePath }]).select();

	try{

		await supabase.storage
		.from('employee-images')
		.upload(imgName,employee.image);

		await supabase.storage
		.from('employee-resumes')
		.upload(resumeName,employee.resume);

	}catch(e:any)
	{
		toast.error("Error creating Employee Account")
		return;
	}
	return data;
}

export async function updateEmployee(employee:Employee, id:number){

	let {	name,
			email,
			password,
			phone,
			location,
			resume,
			industry,
			image} = employee;

			const oldEmployee = await getEmployeeByID(id);

		const imgName = `employee_${employee.name}-${Date.now()}`;
		const resumeName = `employee_${employee.name}_CV-${Date.now()}`;
		const imagePath = `${supabaseUrl}/storage/v1/object/public/employee-images/${imgName}`
		const resumePath = `${supabaseUrl}/storage/v1/object/public/employee-resumes/${resumeName}`
		if(image)
		{
			await supabase.storage
			.from('employee-images')
			.upload(imgName,image);
		}
		if(resume)
		{
			await supabase.storage
			.from('employee-resumes')
			.upload(resumeName,resume);
		}
		if(password)
			password = bcrypt.hashSync(employee.password, 10);

		const updatedEmployee: Employee= {
		name: name || oldEmployee.name,
		email: email || oldEmployee.email,
		phone: phone || oldEmployee.phone,
		password: password || oldEmployee.password,
		location: location || oldEmployee.location,
		resume: resumePath || oldEmployee.resume,
		industry: industry || oldEmployee.industry,
		image: imagePath || oldEmployee.image,
		}


		if(!resume)
		updatedEmployee.resume = oldEmployee.resume;
		if(!image)
		updatedEmployee.image = oldEmployee.image;

		const {error} = await supabase
		.from('employee')
		.update({
		'name':updatedEmployee.name,
		'email':updatedEmployee.email,
		'password':updatedEmployee.password,
		'phone':updatedEmployee.phone,
		'location':updatedEmployee.location,
		'resume':updatedEmployee.resume,
		'industry':updatedEmployee.industry,
		'image':updatedEmployee.image },
		)
		.eq('id', oldEmployee.id)
		.select()

		if(error){
			console.error(error);
			throw new Error(error.message);
		}
		toast.success("Employee Updated Successfully!")

}

export async function deleteEmployee(id: number){
		const {error} = await supabase
		.from('employee')
		.delete()
		.eq('id', id);
		if(error){
			console.error(error);
			throw new Error(error.message);
		}
}


export async function getEmployeeByEmail(email: string)
{
	let { data: employee } = await supabase
	.from('employee')
	.select('*')
	.eq('email', email).single();

	return employee;
}