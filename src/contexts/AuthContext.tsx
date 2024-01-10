import {createContext, useContext, useState} from "react";
import {getCompanyByEmail} from "../supabase/companyAPI";
import toast from "react-hot-toast";
import {getEmployeeByEmail} from "../supabase/employeeAPI";
import {useNavigate} from "react-router-dom";
import {Company, Employee} from "../types/types";
const bcrypt = require('bcryptjs');

interface AuthContextType  {
    signIn: Function,
    signOut: Function,
    company: Company ,
    employee: Employee,
    isAuthenticated: number,
}


const AuthContext = createContext<AuthContextType|undefined>(undefined)


function AuthProvider({children}: {children: React.ReactNode}) {
    const [company, setCompany] = useState<Company>({});
    const [employee, setEmployee] = useState<Employee>({});

    //0 -> false, 1-> Company, 2-> Employee
    const [isAuthenticated,setIsAuthenticated] = useState<number>(0);

    const navigate = useNavigate();

    async function signIn(accountType: string, email: string, password: string){

        if(accountType==='company')
        {
            const company = await getCompanyByEmail(email);
            if(!company)
            {
                toast.error("Company Not Found")
                return;
            }
            else if(!bcrypt.compareSync(password,company.password))
            {
                toast.error("Invalid Password")
                return;
            }
            else
            {
                setCompany(company);
                setIsAuthenticated(1);
            }
        }
        else{
            const employee = await getEmployeeByEmail(email);
            if(!employee)
            {
                toast.error("Employee Not Found")
                return;
            }
            else if(!bcrypt.compareSync(password,employee.password))
            {
                toast.error("Invalid Password")
                return;
            }
            else{
                setEmployee(employee);
                setIsAuthenticated(2);
            }
        }
        toast.success("Signed In Successfully!")
        navigate("/jobs");
    }

    function signOut(){
        setCompany({});
        setEmployee({});
        setIsAuthenticated(0);
        toast.success("Signed out Successfully!")
        navigate("/");
    }

    return <AuthContext.Provider
            value={{
                company,
                employee,
                isAuthenticated,
                signIn,
                signOut,
            }}
        >
        {children}
    </AuthContext.Provider>
}

function useAuth(){
    const context = useContext(AuthContext);
    if(context===undefined)
        throw new Error("Wrong usage");
    return context;
}

export {useAuth,AuthProvider};