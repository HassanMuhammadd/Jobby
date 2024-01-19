import  {useEffect, useState} from 'react'
import {useAuth} from '../../contexts/AuthContext'
import CompanyData from './CompanyData';
import EditCompany from './EditCompany';
import {getCompanyEmployees} from '../../supabase/companyAPI';
import Employee from '../employees/Employee';
import CompanyVacancies from './CompanyVacancies';
import {useCompanies} from '../../contexts/CompaniesContext';

export default function CompanyPersonalProfile() {
  const {company} = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading,setIsloading] = useState(true);
  const {showModal} = useCompanies();
  useEffect(()=>{
    async function fetchEmployees() {
      const res = await getCompanyEmployees(company.id as number);
      setEmployees(res);
      setIsloading(false);
    }
    fetchEmployees();
  },[company])

  return (
    <main className={`min-h-[calc(100vh-107px)] bg-stone-100 p-8 md:p-16 ${showModal && 'opacity-50'}`}>
    <CompanyData company={company}/>
	  <div className=' mt-6 flex flex-col gap-8 lg:flex-row justify-between items-center lg:items-start'>

    <section className='w-full lg:w-2/3'>
      <section className='mb-8'>
      <h4 className='text-lg mb-2 opacity-75 text-center'>Current Vacancies</h4>
      <CompanyVacancies/>
      </section>
      <section>
        <h4 className='text-lg mb-2 opacity-75 text-center'>Employees who work here</h4>
        {isLoading?
        <div className='text-center text-xl my-6'>Loading...</div>:
        employees.map((employee: any,i) => <Employee key={i} employee={employee.employee}/>)
        }
      </section>
    </section>

    <section className='w-full lg:w-1/3'>
      <h4 className='text-lg mb-2 opacity-75 text-center'>Edit Company</h4>
      <EditCompany company={company}/>
    </section>
  </div>
    </main>
  )
}
