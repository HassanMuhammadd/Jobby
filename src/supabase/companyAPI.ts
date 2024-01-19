import toast from "react-hot-toast";
import {Company, Employee} from "../types/types";
import supabase, {supabaseUrl} from "./supabase";
const bcrypt = require('bcryptjs');


export async function getCompanies(){

	let { data: companies} = await supabase
	.from('company')
	.select('*');
	return companies as Company[];
}

export async function getCompanyByID(queryID: number){

	let { data: company} = await supabase
	.from('company')
	.select('*')
	.eq('id', queryID).single();

	return company;
}

export async function getCompaniesCategories(){

	let { data: categories} = await supabase
	.from('company')
	.select('industry')

	const set = new Set(categories?.map((company) => company.industry));
	categories = Array.from(set);
	return categories as any[];
}

export async function addCompany(company:Company)
{
	const imgName = `company_${company.name}-${Date.now()}`;
	const imagePath = `${supabaseUrl}/storage/v1/object/public/company-images/${imgName}`

	company.password = bcrypt.hashSync(company.password, 10);
	const data = await supabase.from("company").insert([{...company, image : imagePath }]).select();

	try{

		await supabase.storage
		.from('company-images')
		.upload(imgName,company.image);

	}catch(e:any)
	{
		toast.error("Error Creating Company Account")
		return;
	}
	return data;
}



export async function updateCompany(company:Company, id:number){

	const {	name,
		email,
		password,
		location,
		industry,
		description,
		foundation_year,
		image} = company;

		const oldCompany = await getCompanyByID(id);

		const imgName = `company_${company.name}-${Date.now()}`;
		const imagePath = `${supabaseUrl}/storage/v1/object/public/company-images/${imgName}`
		if(image)
		{
			await supabase.storage
			.from('company-images')
			.upload(imgName,company.image);
		}

		const updatedCompany: Company= {
		name: name || oldCompany.name,
		email: email || oldCompany.email,
		password: password || oldCompany.password,
		location: location || oldCompany.location,
		description: description || oldCompany.description,
		foundation_year: foundation_year || oldCompany.foundation_year,
		industry: industry || oldCompany.industry,
		image: imagePath || oldCompany.image,
		}

		if(!image)
		{
			updatedCompany.image = oldCompany.image;
		}

		const {error} = await supabase
		.from('company')
		.update({
		'name':updatedCompany.name,
		'email':updatedCompany.email,
		'password':updatedCompany.password,
		'location':updatedCompany.location,
		'description':updatedCompany.description,
		'foundation_year':updatedCompany.foundation_year,
		'industry':updatedCompany.industry,
		'image':updatedCompany.image },
		)
		.eq('id', oldCompany.id)
		.select()
		if(error){
			console.error(error);
			throw new Error(error.message);
		}

		toast.success("Company Updated Successfully!")

}

export async function deleteCompany(id: number){
		const {error} = await supabase
		.from('company')
		.delete()
		.eq('id', id);
		if(error){
			console.error(error);
			throw new Error(error.message);
		}
}

export async function getCompanyByEmail(email: string | undefined)
{
	let { data: company } = await supabase
	.from('company')
	.select('*')
	.eq('email', email).single();

	return company;
}

export async function getCompanyEmployees(id: number)
{
	let { data: company_employees } = await supabase
	.from('company_employees')
	.select('employee (*)')
	.eq('company_id', id);
	return company_employees as {employee: Employee}[];
}

export async function addCompanyEmployee(company_id: number, employee_id: number)
{
	const {error} = await supabase
	.from('company_employees')
	.insert({company_id, employee_id})
	.select();
	if(error)
	{
		console.error(error);
		throw new Error(error.message);
	}
}