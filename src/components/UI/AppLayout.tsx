import React from 'react'
import Nav from './Nav'
import {Outlet} from 'react-router-dom'

export default function AppLayout() {
  return (
	<main>
		<Nav/>
		<Outlet/>
	</main>
  )
}
