import React, {createContext, useContext, useEffect, useState} from 'react'
import {useQuery} from '@tanstack/react-query';
import {Job} from '../types/types';
import {getAllJobs, getJobsCategories, getJobsExperience, getJobsLocation, getJobsType} from '../supabase/jobAPI';
import JobListing from '../components/Jobs/JobListing';

interface jobContextType  {
	jobs: Job[] | undefined,
	categories: string[] | undefined,
	locations: string[] | undefined,
	experiences: string[] | undefined,
	types: string[] | undefined,
	isLoading: boolean,
	salaryFilter: string,
	categoryFilter: string,
	jobsFilter: string[],
	handleJobFilter: Function,
	setSalaryFilter: Function,
	filterJobs: Function,
	displayJobs: Function,
}


const JobsContext = createContext<jobContextType|undefined>(undefined)

export default function JobsProvider({children}: {children: React.ReactNode}) {

	const [industryFilter,setIndustryFilter] = useState<string>('');
	const [categoryFilter,setCategoryFilter] = useState<string>('');
	const [locationFilter,setLocationFilter] = useState<string>('');
	const [typeFilter,setTypeFilter] = useState<string>('');
	const [experienceFilter,setExperienceFilter] = useState<string>('');
	const [salaryFilter,setSalaryFilter] = useState<string>('110000');

	const [filteredJobs,setFilteredJobs] = useState<Job[] | undefined>([]);
	const [jobsFilter,setJobsFilter] = useState<string[]>([]);

	const {data: jobs, isLoading} = useQuery({
		queryKey: ['jobs'],
		queryFn: getAllJobs,
	})
	const {data: categories} = useQuery({
		queryKey: ['jobsCategories'],
		queryFn: getJobsCategories
	})
	const {data: locations} = useQuery({
		queryKey: ['locations'],
		queryFn: getJobsLocation
	})
	const {data: experiences} = useQuery({
		queryKey: ['experience'],
		queryFn: getJobsExperience
	})
	const {data: types} = useQuery({
		queryKey: ['types'],
		queryFn: getJobsType
	})


	function handleJobFilter(choice:string, type:string){

		if(type==='industry'){
			if(choice===industryFilter)
				setIndustryFilter('');
			else
				setIndustryFilter(choice);
		}
		else if(type==='location'){
			if(choice===locationFilter)
				setLocationFilter('');
			else
				setLocationFilter(choice);
		}
		else if(type==='type'){
			if(choice===typeFilter)
				setTypeFilter('');
			else
				setTypeFilter(choice);
		}
		else if(type==='experience'){
			if(choice===experienceFilter)
				setExperienceFilter('');
			else
				setExperienceFilter(choice);
		}
		else if(type==='category')
		{
			if(choice===categoryFilter)
				setCategoryFilter('');
			else
				setCategoryFilter(choice);
		}

	}

	function filterJobs(){
		const filteredJobs = jobs?.filter((job)=>{
			return (industryFilter === '' || job.industry === industryFilter) &&
			(locationFilter === '' || job.location === locationFilter) &&
			(typeFilter === '' || job.type === typeFilter) &&
			(experienceFilter === '' || job.experience === experienceFilter) &&
			(categoryFilter === '' || job.industry === categoryFilter) &&
			(job.salary as number <= Number(salaryFilter))
		})
		setFilteredJobs(filteredJobs);
	}

	function displayJobs(limit:number)
	{
		let ret;
		if(filteredJobs)
			ret = filteredJobs?.map(job=><JobListing key={job.id} job={job}/>)
		else
			ret = jobs?.map(job=><JobListing key={job.id} job={job}/>)
		return ret?.slice(0,limit);
	}


	useEffect(()=>{
		filterJobs();
		setJobsFilter([industryFilter,locationFilter,typeFilter,experienceFilter,salaryFilter,categoryFilter]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[industryFilter,locationFilter,typeFilter,experienceFilter,salaryFilter,categoryFilter])


	return (
	<JobsContext.Provider value={{
		jobs: filteredJobs || jobs,
		isLoading,
		jobsFilter,
		handleJobFilter,
		filterJobs,
		categories,
		locations,
		experiences,
		types,
		displayJobs,
		salaryFilter,
		categoryFilter,
		setSalaryFilter
	}}>
		{children}
	</JobsContext.Provider>
	)
}

export function useJobs(){
	const jobs = useContext(JobsContext);
	if(jobs === undefined){
		throw new Error('useJobs must be used within an JobsProvider')
	}
	return jobs
}