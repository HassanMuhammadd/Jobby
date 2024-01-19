import toast from "react-hot-toast";
import {Job} from "../types/types";
import supabase from "./supabase";

export async function getJobByID(queryID: number){

	let { data: job} = await supabase
	.from('job')
	.select('*')
	.eq('id', queryID).single();

	return job;
}

export async function getAllJobs(){

	try{
		let { data: jobs} = await supabase
		.from('job')
		.select('*');
		return jobs as Job[];

	}catch(e: any){
		toast.error("Can't retreive Jobs now.");
		return;
	}
}
export async function getJobsByCompany(id: number){

	try{

		let { data: jobs} = await supabase
		.from('job')
		.select('*')
		.eq('company_id', id);
		return jobs;
	}catch(e: any)
	{
		toast.error("Error getting Jobs by this Company.");
		return;
	}
}

export async function getJobsLocation(){

	let { data: locations} = await supabase
	.from('job')
	.select('location')

	const set = new Set(locations?.map((job) => job.location));
	locations = Array.from(set);
	return locations as any[];
}

export async function getJobsExperience(){

	let { data: experiences} = await supabase
	.from('job')
	.select('experience')

	const set = new Set(experiences?.map((job) => job.experience));
	experiences = Array.from(set);
	return experiences as any[];
}

export async function getJobsCategories(){

	let { data: categories} = await supabase
	.from('job')
	.select('industry')

	const set = new Set(categories?.map((job) => job.industry));
	categories = Array.from(set);
	return categories as any[];
}

export async function getJobsType(){

	let { data: jobTypes} = await supabase
	.from('job')
	.select('type')
	const set = new Set(jobTypes?.map((job) => job.type));
	jobTypes = Array.from(set);

	return jobTypes as any[];
}

export async function addJob(job: Job){
	const {
			company_id,
			employee_id,
			name,
			industry,
			salary,
			location,
			description,
			experience,
			type,
			created_at} = job;

			const {error} = await supabase
			.from('job')
			.insert([
				{
				'company_id':company_id,
				'employee_id':employee_id,
				'name':name,
				'location':location,
				'description':description,
				'industry':industry,
				'salary':salary,
				'experience':experience,
				'type':type,
				'created_at':created_at,
			},
		])
		.select();

		if(error){
			console.error(error);
			throw new Error(error.message);
		}

}

export async function updateJob(job:Job, id:number){

	const {
		company_id,
		employee_id,
		name,
		industry,
		salary,
		location,
		description,
		experience,
		type,
		created_at} = job;

		const oldJob = await getJobByID(id);

		const updatedJob: Job= {
		company_id: company_id || oldJob.company_id,
		employee_id: employee_id || oldJob.employee_id,
		name: name || oldJob.name,
		location: location || oldJob.location,
		description: description || oldJob.description,
		industry: industry || oldJob.industry,
		salary: salary || oldJob.salary,
		experience: experience || oldJob.experience,
		type: type || oldJob.type,
		created_at: created_at || oldJob.created_at }

		const {error} = await supabase
		.from('job')
		.update({
		'name':updatedJob.name,
		'location':updatedJob.location,
		'description':updatedJob.description,
		'industry':updatedJob.industry,
		'salary':updatedJob.salary,
		'experience':updatedJob.experience,
		'type':updatedJob.type,
		'created_at':updatedJob.created_at
		},
		)
		.eq('id', oldJob.id)
		.select()
		if(error){
			console.error(error);
			throw new Error(error.message);
		}

}

export async function deleteJob(id: number){
		const {error} = await supabase
		.from('job')
		.delete()
		.eq('id', id);
		if(error){
			console.error(error);
			throw new Error(error.message);
		}
}

export async function updateJobEmployee(id: number, employee_id: number){
		const {error} = await supabase
		.from('job')
		.update({employee_id})
		.eq('id', id);
		if(error){
			console.error(error);
			throw new Error(error.message);
		}
}