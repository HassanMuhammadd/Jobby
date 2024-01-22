const company = require("../model/company");
const bcrypt = require("bcrypt");
const validator = require("validator")
const asynchandler = require("express-async-handler");
const generate = require("../util/genToken")
const job = require("../model/job");


const signUp = asynchandler(async(req,res)=>{
   console.log(req.file);
    const {name,email,password,retypePassword,phone,industry,location,description,foundationYear} = req.body;
  
    if((!name) || (!email) || (!password) || (!retypePassword) || (!phone) || (!industry) || (!location)
        || (!description) || (!foundationYear)){
        console.log("All fields are required");
        return res.json({error:"All fields are required"});
     }

     if(!validator.isEmail(email)){
        return res.json({error:"Email is not correct"});
     }
   
     const retrieveCompany = await company.findOne({email});
     if(retrieveCompany){
        return res.json({error:"Email already exists"})
     }

     const encryptedPassword = await bcrypt.hash(password,10);
 
     const newCompany = new company({
        name,
        email,
        password:encryptedPassword,
        retypePassword:encryptedPassword,
        phone,
        industry,
        location,
        description,
        foundationYear,
        avatar : req.file.filename
     });
     const token = await generate({id:newCompany._id});
     newCompany.token = token
     newCompany.save();
     res.json({Company : newCompany}); 
})

const signIn = asynchandler (async(req,res)=>{
    const {email, password} = req.body;
    if(!email || !validator.isEmail(email)){
       return res.json({error:"Email is not correct"});
    }

    const retrieveCompany = await company.findOne({email});
    if(!retrieveCompany){
     return res.json({error:"Email is not correct"});
    }
    const checkPassword = await bcrypt.compare(password,retrieveCompany.password);
    if(!checkPassword){
      return res.json({error:"Password is not correct"});
    }
    const token = await generate({id:retrieveCompany._id});
    retrieveCompany.token = token
    retrieveCompany.save()
    console.log("LoggedIn successfully")
    res.json({Company:retrieveCompany})

})

const changePassword = asynchandler(async(req,res)=>{

   const {email, oldPassword, newPassword, confirmPassword} = req.body;
   const fetchCompany = await company.findOne({email});
   if(!email || !validator.isEmail(email)){
       return res.json({error:"Email is not found"});
   } 
   const password = fetchCompany.password;
   const checkPassword = await bcrypt.compare(oldPassword,password);
   if(!checkPassword){
      return res.json({error:"Old password is not correct"});
   }
   if(newPassword!==confirmPassword){
      return res.json({error:"Oops! The passwords you entered don't match. Please try again"});
   }
   const updatedPassword = await bcrypt.hash(newPassword,10);
   const confirmationPassword = await bcrypt.hash(confirmPassword,10);
   fetchCompany.password = updatedPassword;
   fetchCompany.retypePassword = confirmationPassword;
   fetchCompany.save()
   res.json("updated successfully")
})

const addJob = asynchandler(async(req,res)=>{
   const {name,category,salary,location,description,experience,type} = req.body;
   const companyId = req.current.id
   const newJob = new job ({
      name,
      companyId,
      category,
      salary,
      location,
      description,
      experience,
      type
   })
   newJob.save();
   // adding in jobIds array
   await company.findOneAndUpdate(
      {_id:companyId},
      {$push:{jobIds:newJob._id}}
   )
  
   res.json("Job added succesffully");
  
})

module.exports = {
    signUp,
    signIn,
    changePassword,
    addJob
}
