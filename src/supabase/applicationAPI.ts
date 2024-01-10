import {Employee} from "../types/types";
import supabase, {supabaseUrl} from "./supabase";

export async function addApplication(job_id: number, employee: Employee, uploadedResume: any = null)
{

	const resumeName = `employee_${employee.name}_CV-${Date.now()}`;
	let resumePath = `${supabaseUrl}/storage/v1/object/public/employee-resumes/${resumeName}`

	if(uploadedResume===null)
	{
		resumePath = uploadedResume;
	}
	else
	{
		await supabase.storage
		.from('employee-resumes')
		.upload(resumeName,uploadedResume);
	}

	const {data} = await supabase.from("applications")
	.insert([{
			job_id,
			employee_id: employee.id,
			status: "pending",
			created_at: new Date(),
			resume: resumePath}])
	.select();

	return data;
}