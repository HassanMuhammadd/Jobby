import {useState} from 'react'
import {useAuth} from '../../contexts/AuthContext';
import Input from './Input'
import Button from './Button';

export default function SignIn() {

  const [accountType, setAccountType] = useState('company');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {signIn} = useAuth();

  return (
    <div className="holder flex flex-col  justify-center bg-stone-100 ">
      <h4 className='text-center my-4'>Sign In Now!</h4>

      <form className='containerShadow flex flex-col mx-auto px-8 py-16 items-center justify-center border-2 rounded-lg border-emerald-700' onSubmit={(e)=>e.preventDefault()}>
        <label htmlFor="accountType" className='mb-2'>Account Type</label>
        <select className='input px-3 py-2 border-emerald-900 border-b-2 mb-3 bg-transparent cursor-pointer' id='accountType'  onChange={(e)=>setAccountType(e.target.value)}>
          <option value="company">Company</option>
          <option value="employee">Employee</option>
        </select>
        <Input name='Email' type='email' value={email} onChange={(e:string)=>setEmail(e)}/>
        <Input name='Password' type='password' value={password} onChange={(e:string)=>setPassword(e)}/>
        <Button onClick={()=>signIn(accountType,email,password)} text="Sign In"/>
        <button className='border-none text-xs text-red-400 hover:text-red-700 transition-all duration-200 '>Forgot Password?</button>
      </form>
    </div>
  )
}
