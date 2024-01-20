import './App.css';
import Landing from './components/UI/Landing';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import AppLayout from './components/UI/AppLayout';
import Companies from './components/companies/Companies';
import Jobs from './components/Jobs/Jobs';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Employees from './components/employees/Employees';
import CompanyPage from './components/companies/CompanyPage';
import JobPage from './components/Jobs/JobPage';
import {Toaster} from 'react-hot-toast';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import EmployeesProvider from './contexts/EmployeesContext';
import CompaniesProvider from './contexts/CompaniesContext';
import JobsProvider from './contexts/JobsContext';
import {AuthProvider} from './contexts/AuthContext';
import PersonalProfile from './components/UI/PersonalProfile';
import Applicants from './components/applications/Applicants';
import PasswordReset from './components/auth/PasswordReset';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    }
  }
});

function App() {
  return (

    <QueryClientProvider client={queryClient}>

      <BrowserRouter>
      <AuthProvider>
      <CompaniesProvider>
      <EmployeesProvider >
      <JobsProvider>
          <Routes>
            <Route path='/' element={<AppLayout/>}>
              <Route index element={<Navigate replace to="/home"/>}/>
              <Route path='/home' element={<Landing/>}/>
              <Route path='/companies' element={<Companies/>}/>
              <Route path='/companies/:id' element={<CompanyPage/>}/>
              <Route path='/jobs' element={<Jobs/>}/>
              <Route path='/jobs/:jobId' element={<JobPage/>}/>
              <Route path='/jobs/:jobId/view' element={<Applicants/>}/>
              <Route path='/employees' element={<Employees/>}/>
              <Route path='/sign-in' element={<SignIn/>}/>
              <Route path='/sign-up' element={<SignUp/>}/>
              <Route path='/profile/:id' element={<PersonalProfile/>}/>
              <Route path='/reset' element={<PasswordReset/>}/>
              <Route path='*' element={<Navigate replace to="/home"/>}/>
            </Route>
          </Routes>
          <Toaster
              toastOptions={{duration: 3000}}
              position='bottom-right'
              gutter={12}
              containerStyle={{margin: '10px'}}
            />
    </JobsProvider>
    </EmployeesProvider>
    </CompaniesProvider>
    </AuthProvider>
    </BrowserRouter>

    </QueryClientProvider>

  );
}

export default App;
