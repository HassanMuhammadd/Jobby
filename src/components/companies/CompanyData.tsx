import React from 'react'
import {BsPersonWorkspace} from 'react-icons/bs'
import {FaLocationDot} from 'react-icons/fa6'
import {MdEmail} from 'react-icons/md'
import {Company} from '../../types/types'
import {FaAddressBook} from 'react-icons/fa'

export default function CompanyData({company}: {company: Company}) {
  return (
	<>
		<img src={company.image} className='p-1 bg-emerald-700 w-32 h-32 mb-6' alt='company logo'/>
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
