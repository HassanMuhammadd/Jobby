import React, {useState} from 'react'
import Input from './Input'
import toast from 'react-hot-toast';
import {getEmployeeByEmail, updateEmployee} from '../../supabase/employeeAPI';
import {useQueryClient} from '@tanstack/react-query';
const bcrypt = require('bcryptjs');

export default function PasswordReset() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [oldPassword,setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const queryClient = useQueryClient();

    async function resetPassword(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const employee = await getEmployeeByEmail(email);
      if(!employee)
      {
        toast.error('Employee not found');
        return;
      }
      if(!bcrypt.compareSync(oldPassword,employee.password))
      {
        toast.error('Old password is incorrect');
        return;
      }
      if(password !== confirmPassword)
      {
        toast.error('Passwords do not match');
        return;
      }
      if(password.length < 6)
      {
        toast.error('Password must be at least 6 characters');
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
      const updatedEmployee = {
        password
      }

      if(employee.id)
      {
        updateEmployee(updatedEmployee, employee.id);
        queryClient.invalidateQueries({queryKey: ['employees']});
      }

    }

  return (
    <div className='h-[calc(100vh-100px)] flex justify-center items-center bg-stone-100'>

      <form className='containerShadow w-[300px]  mx-auto  bg-white flex flex-col items-center  p-8 border-2 rounded-lg border-emerald-700' onSubmit={(e)=>resetPassword(e)}>
        <Input name='Email' type='email' value={email} onChange={(e:string)=>setEmail(e)}/>
        <Input name="Old Password" type='password' value ={oldPassword} onChange={(e: string)=>setOldPassword(e)}/>
        <Input name="New Password" type='password' value ={password} onChange={(e: string)=>setPassword(e)}/>
        <Input name="Confirm Password" type='password' value ={confirmPassword} onChange={(e: string)=>setConfirmPassword(e)}/>
        <button type="submit" className=' mt-6 border-black border-2 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200 mb-3'>Reset Password</button>

      </form>
    </div>
  )
}
