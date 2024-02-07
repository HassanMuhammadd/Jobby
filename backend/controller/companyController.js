const company = require("../model/company");
const bcrypt = require("bcrypt");
const validator = require("validator")
const asynchandler = require("express-async-handler");
const generate = require("../util/genToken")
const job = require("../model/job");
const common = require("../util/common")
const user = require("../model/user");
const { companyValidation } = require('../Middleware/companyValidations')

const signUp = asynchandler(async(req,res)=>{
    let {name,email,password,retypePassword,phone,industry,location,description,foundationYear} = req.body;
    email = email.trim();
    password = password.trim();
    retypePassword = retypePassword.trim();
    req.body.password = password;
    req.body.retypePassword = retypePassword;
    req.body.email = email;
     try{
        await companyValidation.validate(req.body)
     } catch(err){
        console.log("All fields are required");
        return res.json({error:err.message});
     }

     if(!validator.isEmail(email)){
        return res.json({error:"Email is not correct"});
     }
   
     const retrieveCompany = await company.findOne({email});
     if(retrieveCompany){
        return res.json({error:"Email already exists"})
     }

     if(password!=retypePassword){
      return res.json({error:"Password does not match"})
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
        avatar : req.file?.filename
     });
     const token = await generate({id:newCompany._id,email:newCompany.email});
     newCompany.token = token
     const check = await common.confirmSignUp(email,name);
     if(check=="error"){
        return res.send("error in signing up");
     }
     newCompany.save();
     res.json({Company : newCompany}); 
})

const signIn = asynchandler (async(req,res)=>{
    let {email, password} = req.body;
    email = email.trim();
    password = password.trim();
    if(!email || !validator.isEmail(email)){
       return res.json({error:"Email is not correct"});
    }

    const retrieveCompany = await company.findOne({email:email.toLowerCase()});
    if(!retrieveCompany){
     return res.json({error:"Email is not correct"});
    }

    const checkPassword = await bcrypt.compare(password,retrieveCompany.password);
    if(!checkPassword){
      return res.json({error:"Password is not correct"});
    }
    const token = await generate({id:retrieveCompany._id,email:retrieveCompany.email});
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

const updateInfo = asynchandler (async (req,res) => {
   let { password, retypePassword, email } = req.body;
   password = password.trim();
   email = email.trim();
   retypePassword = retypePassword.trim();
   if(password!=retypePassword){
      return res.status(400).json({error:"password does not match retype password"});
   }
 
   req.body.password = password;
   req.body.retypePassword = retypePassword;
   req.body.email = email;
   console.log(req.body);
   await companyValidation.validate(req.body)
   const returnedData = await common.updateModelInfo(company,req.current.id,req.body,res,req.file,req.current.email,req)
   res.send(returnedData)
})

const getJobs = asynchandler(async(req,res)=>{
   const compId = req.current.id;
   const jobs = await job.find({companyId:compId});
   res.status(200).json({
      jobs:jobs,
      csrfToken : res.csrfToken
   })
})

const getUsers = asynchandler(async(req,res)=>{
    const jobId = req.params.id;
    console.log(jobId)
    const Job = await job.findOne({_id:jobId});
    let employees = [];
    if(Job!=null){
      employees = Job.employeeIds;
    }
    res.status(200).json({employees:employees},{
      csrfToken : res.csrfToken
    })
})

const getAllUsers = asynchandler(async(req,res)=>{
    const compId = req.current.id;
    const users = await user.find({companyIds:{$in:compId}})
    res.json({"All users in current company":users,
    csrfToken : res.csrfToken})
})

const validateUser = asynchandler(async(req,res)=>{
    const userId = req.params.userId;
    const jobId = req.params.jobId;
    const status = req.body.status;
    const updatedUser = await common.updateStatus(jobId, userId, status);
    if(status=="rejected"){
      console.log("heereee")
      await job.updateOne(
         {
             _id:jobId
         },
         {
            $pull:{employeeIds:{userId: userId}}
         }
      )

      return res.send("status updated => rejected")
    }
   //  res.status(200).json(updatedUser)
    //-----------------------------
    const User = await user.findOneAndUpdate(
      {
         _id:userId
      },
      {
         $push: {jobIds:jobId, companyIds:req.current.id}
      },
      {
         new:true
      }
    )
   //  res.status(200).json(User);
   //-----------------------------
    const updateCompanyArray = await company.findOneAndUpdate(
      {
         _id:req.current.id
      },
      {
         $push:{userIds:userId}
      },
      {
         new:true
      }
    )
        res.status(200).json({message:"User state has been changed successfully"});


})


const viewCv = asynchandler(async(req,res)=>{

    const userId = req.params.userId;
    const jobId = req.params.jobId;
    const findJob = await company.findOne({_id:req.current.id , jobIds :{$in : jobId} });

    if(!findJob){
      return res.status(500).send("Not authorized");
    }
    console.log("hereddd");
    user.findOne({_id:userId})
    .then(fetchedUser=>{
      const cvPath = fetchedUser.cv;
      return res.send.json({
         cvPath:cvPath,
         csrfToken : res.csrfToken
      });
    })
    .catch(err=>{
      res.send({error:err,
         csrfToken : res.csrfToken});
    })
})



module.exports = {
    signUp,
    signIn,
    changePassword,
    addJob,
    updateInfo,
    getJobs,
    getUsers,
    validateUser,
    getAllUsers,
    viewCv
}
