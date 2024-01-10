export type Employee = {
	id?: number,
	name?: string,
	email?: string,
	password?: string,
	phone?: string,
	location?: string,
	resume?: any,
	industry?: string,
	image?: any,
}

export type Company = {
	id?: number,
	name?: string,
	email?: string,
	password?: string,
	industry?: string,
	location?: string,
	description?: string,
	foundation_year?: number,
	image?: any,
}

export type Job = {
	id?: number,
	company_id?: number,
	employee_id?: number,
	name?: string,
	industry?: string,
	salary?: number,
	location?: string,
	description?: string,
	experience?: string,
	type?: string,
	created_at: Date,
}