import {BsPersonWorkspace} from 'react-icons/bs'
import {FaLocationDot} from 'react-icons/fa6'
import {MdEmail} from 'react-icons/md'
import {Company} from '../../types/types'
import {FaAddressBook} from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import AddJob from '../Jobs/AddJob'
import {useCompanies} from '../../contexts/CompaniesContext'

export default function CompanyData({company}: {company: Company}) {
	const url = useLocation().pathname;
	const {showModal,setShowModal} = useCompanies();

  return (
	<>
		<div className="flex flex-row justify-start items-center gap-16 ">
			<img src={company.image} className='p-1 bg-emerald-700 w-32 h-32 mb-6' alt='company logo'/>
			{url.includes('/profile') && <button onClick={()=>setShowModal(!showModal)} className='border-black text-xs md:text-base  border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-150'>Add a Job</button>}
			{showModal && <AddJob company={company}/>}
		</div>
	<div>
		<h1 className='text-2xl font-bold uppercase tracking-normal mb-2'>{company.name}</h1>
		<div className='text-sm opacity-75 flex flex-row gap-2 items-center'><BsPersonWorkspace size={12} /> {company.industry}</div>
		<h4 className='text-sm opacity-75  flex flex-row gap-2 items-center'><MdEmail size={12}/> {company.email}</h4>
		<h4 className='text-sm opacity-75  flex flex-row gap-2 items-center'><FaLocationDot size={12}/> {company.location}</h4>
		<h4 className='text-sm opacity-75  flex flex-row gap-2 items-center'><FaAddressBook size={12}/> {company.description}</h4>
	</div>
	</>
  )
}
