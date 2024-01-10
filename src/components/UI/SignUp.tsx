import {useState} from 'react'
import Input from './Input';
import toast from 'react-hot-toast';
import {addCompany, getCompanyByEmail} from '../../supabase/companyAPI';
import {useNavigate} from 'react-router-dom';
import {addEmployee, getEmployeeByEmail} from '../../supabase/employeeAPI';
import Button from './Button';

export default function SignUp() {

  const [accountType, setAccountType] = useState('company');

  const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [retypedPassword, setRetypedPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [industry, setIndustry] = useState('');
	const [location, setLocation] = useState('');
	const [description, setDescription] = useState('');
	const [foundationYear,setFoundationYear] = useState(new Date().getFullYear());
  const [image,setImage] = useState<any>();
  const [resume,setResume] = useState<any>();

	const navigate = useNavigate();

	const handleImage = (e: React.ChangeEvent<HTMLInputElement> | any): void => {
		const files = Array.from(e.target.files)
		setImage(files[0]);
	}
  const handleResume = (e: React.ChangeEvent<HTMLInputElement> | any): void => {
    const files = Array.from(e.target.files)
    setResume(files[0]);
  }

  async function handleSignUp(){
    if(password !== retypedPassword){
      toast.error("Passwords Do not Match")
			return;
		}
		if(password.length<6){
			toast.error("Password must be at least 6 characters")
			return;
		}
    toast.custom(() => (
      <div
        style={{
          color: 'white',
          backgroundColor: '#50d154',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        Loading
      </div>
    ))
    if(accountType==='company')
    {

        const oldCompany = await getCompanyByEmail(email);
        if(oldCompany)
        {
          toast.error("Email Already Exists")
          return;
        }

        if(foundationYear > new Date().getFullYear()){
          toast.error("Foundation year cannot be in the future")
          return;
        }

        const res =await addCompany({
          name,
          email,
          password,
          industry,
          location,
          description,
          foundation_year:foundationYear,
          image
        });
        if((res && res.error )|| !res)
          return;
        toast.success("Company Created")
    }
    else{
        const oldEmployee = await getEmployeeByEmail(email);
        if(oldEmployee)
        {
          toast.error("Email Already Exists")
          return;
        }

        const res = await addEmployee({
          name,
          email,
          password,
          phone,
          industry,
          location,
          image,
          resume,
        });
        if((res && res.error) || !res)
          return;
        toast.success("Employee Created")
    }
		navigate("/jobs");

	}



  return (
    <div className="min-h-[calc(100vh-107px)] pt-8 pb-16 flex flex-col justify-center bg-stone-100">
      <h4 className='text-center my-4'>Create A New Account Now!</h4>
      <form className='containerShadow flex flex-col mx-auto px-8 py-6 items-center justify-center border-2 rounded-lg border-emerald-700' onSubmit={(e)=>e.preventDefault()}>
        <label htmlFor="accountType" className='mb-2'>Account Type</label>
        <select className='input px-3 py-2 border-emerald-900 border-b-2 mb-3 bg-transparent' id='accountType'  onChange={(e)=>setAccountType(e.target.value)}>
          <option value="company">Company</option>
          <option value="employee">Employee</option>
        </select>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-6'>
            <Input name='Name' type='text' value={name} onChange={(e:string)=>setName(e)}/>
            <Input name='Email' type='email' value={email} onChange={(e:string)=>setEmail(e)}/>
            <Input name='Password' type='password' value={password} onChange={(e:string)=>setPassword(e)}/>
            <Input name='Retype Password' type='password' value={retypedPassword} onChange={(e:string)=>setRetypedPassword(e)}/>
            {accountType==='employee' && <Input name='Phone' type='text' value={phone} onChange={(e:string)=>setPhone(e)}/>}
            <Input name='Industry' type='text' value={industry} onChange={(e:string)=>setIndustry(e)}/>
            <Input name='Location' type='text' value={location} onChange={(e:string)=>setLocation(e)}/>
            {accountType==='company' && <Input name='Description' type='text' value={description} onChange={(e:string)=>setDescription(e)}/>}
            {accountType==='company' && <Input name='Foundation Year' type='number' value={foundationYear} onChange={(e:number)=>setFoundationYear(e)}/>}
            {accountType==='employee' &&
              <div className='flex flex-col  mb-4'>
                <label htmlFor='resume' className='mb-2'>Resume</label>
                <input type='file' accept='.pdf , .docx' required id='resume' className='border-2 border-emerald-700 custom-file' onChange={(e)=>handleResume(e)} />
              </div>
            }
            <div className='flex flex-col  mb-4'>
                <label htmlFor='image' className='mb-2'>Image</label>
                <input type='file' accept='image/*' required id='image'  className='border-2 border-emerald-700 custom-file' onChange={(e)=>handleImage(e)} />
            </div>
        </div>

        <Button onClick={handleSignUp} text="Sign Up"/>
      </form>
    </div>
  )
}
