import  { useState} from 'react'
import { NavLink, useLocation, useNavigate} from 'react-router-dom';
import Searchbar from './Searchbar';
import {useWindowResize} from '../../hooks/useWindowResize';
import {useAuth} from '../../contexts/AuthContext';

export default function Nav() {
	const navigate = useNavigate();
	const [showUl,setShowUl] = useState(true);
	const handleChangeUl = ()=>{
		if(screenWidth<=890)
			setShowUl(!showUl);
	}
	const {isAuthenticated, signOut, company, employee} = useAuth();
	const screenWidth = useWindowResize(setShowUl,890);
	const url = useLocation().pathname;

	return (
	<nav className="flex flex-row justify-between items-center  py-8 px-16 ">
		<button className='text-3xl' onClick={()=>navigate('/')}>JOBBY</button>
		<Searchbar/>
		<div className={`navItems items-center bg-white ${showUl && screenWidth<=890 && 'boxShadow'} `}>

			{showUl &&<>
			<div className='ulItems '>
				<button className='menuIcon bg-red-500  text-white px-2 py-1 ' onClick={() => setShowUl(!showUl)}>X</button>
				<NavLink onClick={handleChangeUl} to='/home' className={`link px-2 py-1 rounded-md ${url==='/home'?'activeLink':''}`}>Home</NavLink>
				<NavLink onClick={handleChangeUl} to='/jobs' className={`link px-2 py-1 rounded-md ${url==='/jobs'?'activeLink':''}`}>Jobs</NavLink>
				<NavLink onClick={handleChangeUl} to='/companies' className={`link px-2 py-1 rounded-md ${url==='/companies'?'activeLink':''}`}>Companies</NavLink>
				<NavLink onClick={handleChangeUl} to='/employees' className={`link px-2 py-1 rounded-md ${url==='/employees'?'activeLink':''}`}>Employees</NavLink>
			</div>

			<div className='flex flex-row gap-4 registerButtons'>
				{!isAuthenticated?
				<>
					<NavLink onClick={handleChangeUl} to='/sign-in' className={`border-black border-2 px-4 py-2 rounded-full hover:bg-black  hover:text-white transition-all duration-200 ${url==='/sign-in'?'bg-black text-white':''} `}>Sign In</NavLink>
					<NavLink onClick={handleChangeUl} to='/sign-up' className={`border-black border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200 ${url==='/sign-up'?'bg-black text-white':''} `}>Sign Up</NavLink>
				</>
				:
				<>
					<NavLink to={`${company.id ? `/profile/${company.id}`:`/profile/${employee.id}`}`} className='border-black border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200'>Profile</NavLink>
					<button onClick={()=>signOut()} className={`border-black border-2 px-4 py-2 rounded-full hover:bg-black  hover:text-white transition-all duration-200`}>Sign Out</button>
				</>
				}
			</div>
			</>}

			{!showUl &&<button className='menuIcon  text-3xl' onClick={() => setShowUl(!showUl)}>=</button>}
		</div>
	</nav>
    )
}
