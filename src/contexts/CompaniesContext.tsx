import React, {createContext, useContext, useEffect, useState} from 'react'
import {useQuery} from '@tanstack/react-query';
import {getCompanies, getCompaniesCategories} from '../supabase/companyAPI';
import {Company as Comp} from '../types/types';
import Company from '../components/companies/Company';

interface companiesContextType  {
	companies: Comp[] | undefined,
	categories: string[] | undefined,
	isLoading: boolean,
	companiesFilter: string,
	handleCompanyFilter: Function,
	filterCompanies: Function,
	displayCompanies: Function,
	showModal: boolean,
	setShowModal: Function,
}


const CompaniesContext = createContext<companiesContextType|undefined>(undefined)

export default function CompaniesProvider({children}: {children: React.ReactNode}) {

	const [companiesFilter,setCompaniesFilter] = useState<string>('');
	const [filteredCompanies,setFilteredCompanies] = useState<Comp[] | undefined>([]);
	const [showModal,setShowModal] = useState(false);

	const {data: companies, isLoading} = useQuery({
		queryKey: ['companies'],
		queryFn: getCompanies,
	})

	const {data: categories} = useQuery({
		queryKey: ['companyCategories'],
		queryFn: getCompaniesCategories
	})
	function handleCompanyFilter(choice:string){
		if(choice===companiesFilter)
		{
			setCompaniesFilter('');
		}
		else
		{
			setCompaniesFilter(choice)
		}

	}

	function filterCompanies(){
		const filteredCompanies = companies?.filter((company)=>company.industry?.toLowerCase()===companiesFilter.toLowerCase() || companiesFilter.toLowerCase()==='' );
		setFilteredCompanies(filteredCompanies);
	}

	function displayCompanies(limit:number)
	{
		let ret;
		if(filteredCompanies)
			ret = filteredCompanies?.map(company=><Company key={company.id} company={company}/>)
		else
			ret = companies?.map(company=><Company key={company.id} company={company}/>)

		return ret?.slice(0,limit);
	}


	useEffect(()=>{
		filterCompanies();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[companiesFilter])



	return (
	<CompaniesContext.Provider value={{
		companies: filteredCompanies || companies,
		isLoading,
		companiesFilter,
		handleCompanyFilter,
		filterCompanies,
		categories,
		displayCompanies,
		showModal,
		setShowModal
	}}>
		{children}
	</CompaniesContext.Provider>
	)
}

export function useCompanies(){
	const companies = useContext(CompaniesContext);
	if(companies === undefined){
		throw new Error('useCompanies must be used within an CompaniesProvider')
	}
	return companies
}