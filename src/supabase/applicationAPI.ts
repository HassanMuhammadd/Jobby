import toast from "react-hot-toast";
import {Application, Employee} from "../types/types";
import supabase, {supabaseUrl} from "./supabase";

export async function addApplication(job_id: number, employee: Employee, uploadedResume: any = null)
{
	const resumeName = `employee_${employee.name}_CV-${Date.now()}`;
	let resumePath = `${supabaseUrl}/storage/v1/object/public/employee-resumes/${resumeName}`

	if(uploadedResume===null)
	{
		resumePath = employee.resume;
	}
	else
	{
		await supabase.storage
		.from('employee-resumes')
		.upload(resumeName,uploadedResume);
	}

		const {data} = await supabase.from("application")
		.insert([{
				job_id: job_id,
				employee_id: employee.id,
				status: "pending",
				created_at: new Date(),
				resume: resumePath}])
				.select();

	return data;
}

export async function checkOldApplication(job_id: number, employee: Employee)
{
	const {data} = await supabase.from("application")
		.select()
		.eq('job_id', job_id)
		.eq('employee_id', employee.id);

		if(data && data.length>0)
			return true
		return false;

}

export async function getApplications(job_id: number)
{
	const {data} = await supabase.from("application")
		.select()
		.eq('job_id', job_id);

	return data as Application[];
}

export async function getEmployeeApplication(employee_id: number, job_id: number)
{
	const {data} = await supabase.from("application")
		.select()
		.eq('employee_id', employee_id)
		.eq('job_id', job_id).single();

	return data as Application;
}

export async function getEmployeeApplications(employee_id: number)
{
	const {data} = await supabase.from("application")
		.select()
		.eq('employee_id', employee_id);
	return data as Application[];
}

export async function updateApplication(application: Application,status: string)
{
	try{

		const {data} = await supabase.from("application")
		.update({status: status})
		.eq('id', application.id);
		toast.success("Application Status Updated");

		return data;
	}catch(e)
	{
		console.log(e);
	}
}