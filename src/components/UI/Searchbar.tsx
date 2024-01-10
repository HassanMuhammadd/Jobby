import React from 'react'

export default function Searchbar() {
  return (
	<div>
		<input type="text" placeholder="Search..." className=" hidden lg:block searchbar transition-all duration-100 w-44 focus:w-1/5 border-2 border-emerald-700 p-2 rounded-full" />
	</div>
  )
}
