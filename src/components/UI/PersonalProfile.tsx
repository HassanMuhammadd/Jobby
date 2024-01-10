import {useAuth} from '../../contexts/AuthContext'
import CompanyPersonalProfile from '../companies/CompanyPersonalProfile';
import EmployeePersonalProfile from '../employees/EmployeePersonalProfile';

export default function PersonalProfile() {
	const {isAuthenticated} = useAuth();
  return (
	isAuthenticated === 1? <CompanyPersonalProfile/> : <EmployeePersonalProfile/>
  )
}
