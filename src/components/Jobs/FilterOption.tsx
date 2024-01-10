import  {useState} from 'react'
import { IoIosArrowUp } from 'react-icons/io';
import { IoIosArrowDown } from 'react-icons/io';
import {useCompanies} from '../../contexts/CompaniesContext';
import {useJobs} from '../../contexts/JobsContext';
import {useLocation} from 'react-router-dom';

interface props {
	title:string,
	names: string[] | undefined,
	onChange: (value: string) => void
}
export default function FilterOption(props:props) {
	const [show,setShow] = useState(false);
	const {title,names,onChange} = props;
	const {companiesFilter} = useCompanies();
	const {jobsFilter} = useJobs();

	const url = useLocation().pathname;
	return (
	<>
	<div onClick={()=>setShow(!show)} className={` ${show?'active bg-emerald-700 text-white':''}  cursor-pointer border-b-2  border-emerald-700 hover:bg-emerald-900 hover:text-white p-3 transition-all duration-100 flex flex-row justify-between items-center`}>
				<h6>{title}</h6>
				{show ? <IoIosArrowUp /> : <IoIosArrowDown />}

			</div>
			<div className={`${show ? 'block' : 'hidden'}  `}>
				{names?.map((name,index)=>{
					return (
						<div key={index} className=' flex px-3 py-1  items-center gap-1 hover:bg-stone-200 cursor-pointer ' onClick={()=>onChange(name)}>
							<input
								type="radio"
								id={name}
								name={title}
								value={name}
								checked={url==='/jobs'?jobsFilter.includes(name) :companiesFilter===name}
								onChange={()=>onChange(name)}
							/>
							<label className='cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap' >{name}</label>
							<br/>
						</div>
					)
				})}

			</div>
	</>
)
}
