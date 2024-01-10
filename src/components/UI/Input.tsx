import React from 'react'

interface props{
	name:string,
	type:string,
	value:string | number | undefined ,
	onChange: Function
}
export default function Input({name,type,value,onChange}:props) {
  return (
	<div className='flex flex-col mb-4'>
		<label htmlFor={name}>{name}</label>
		<input
		type={type}
		required id={name}
		value={value}
		className='input px-3 py-2 bg-transparent border-emerald-900 border-b-2' onChange={(e)=>onChange(e.target.value)} />
	</div>
  )
}
