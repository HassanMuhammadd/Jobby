const mongoose = require('mongoose')
const asynchandler = require('express-async-handler')
const validator = require("validator");
const user = require("../model/user")
const bcrypt = require("bcrypt");
const generate = require("../util/genToken")
const job = require("../model/job")


const signUp = asynchandler (async(req,res,next) => {
   // console.log(req.file)
    const {name,email,password,retypePassword,phone,industry,location} = req.body;
    //   console.log(req.body);
      if((!name) || (!email) || (!password) || (!retypePassword) || (!phone) || (!industry) || (!location)){
         console.log("All fields are required");
         return res.json({error:"All fields are required"});
      }
      if(!validator.isEmail(email)){
         return res.json({error:"Email is not correct"});
      }
    
      const retrieveUser = await user.findOne({email});
      if(retrieveUser){
         return res.json({error:"Email already exists"})
      }
      
      if(password!=retypePassword){
         return res.json({error:"Password doesnot match"})
      }
      
      // console.log(req.file.filename)
      let avat;
      if(!req.file){
        avat = "company-1705777891413.jpeg"
      }
      else{
         avat = req.file.filename;
      }
      console.log("heeerr");
      const encryptedPassword = await bcrypt.hash(password,10);
      const newUser = new user({
         name,
         email,
         password:encryptedPassword,
         retypePassword:encryptedPassword,
         phone,
         industry,
         location,
         avatar:avat
      });
      const token = await generate({id:newUser._id})
      newUser.token = token;
      // console.log(newUser)
      
      newUser.save();
      res.json({User : newUser}); 
})

const signIn = asynchandler (async(req,res,next) => {
     const {email, password} = req.body;
     if(!email || !validator.isEmail(email)){
        return res.json({error:"Email is not correct"});
     }

     const retrieveUser = await user.findOne({email});
     if(!retrieveUser){
      return res.json({error:"Email is not correct"});
     }
     const checkPassword = await bcrypt.compare(password,retrieveUser.password);
     if(!checkPassword){
       return res.json({error:"Password is not correct"});
     }
     const token = await generate({id:retrieveUser._id});
     retrieveUser.token = token;
     retrieveUser.save();
     console.log("LoggedIn successfully")
     res.json({User:retrieveUser})
})
const changePassword = asynchandler(async(req,res)=>{

   const {email, oldPassword, newPassword, confirmPassword} = req.body;
   const fetchUser = await user.findOne({email});
   if(!email || !validator.isEmail(email)){
       return res.json({error:"Email is not found"});
   } 
   const password = fetchUser.password;
   const checkPassword = await bcrypt.compare(oldPassword,password);
   if(!checkPassword){
      return res.json({error:"Old password is not correct"});
   }
   if(newPassword!==confirmPassword){
      return res.json({error:"Oops! The passwords you entered don't match. Please try again"});
   }
   const updatedPassword = await bcrypt.hash(newPassword,10);
   const confirmationPassword = await bcrypt.hash(confirmPassword,10);
   fetchUser.password = updatedPassword;
   fetchUser.retypePassword = confirmationPassword;
   fetchUser.save()
   res.json("updated successfully")
})

const applyJob = asynchandler (async(req,res,next)=>{
   const jobId = req.params.id;
   const curJob = await job.findOne({_id:jobId});
   const userId = req.current.id;

   if(req.file){
      const newCv = req.file.filename;
      await job.findByIdAndUpdate(
         {_id: jobId},
         {
            $push: { employeeIds: {userId: userId,newCv:newCv}}
         }
      )
      res.json("succeeded")
   }
   else{
      const fetchUser = await user.findOne({_id:userId});
      curJob.employeeIds.push({userId},{newCv:fetchUser.avatar})
      await job.findOneAndUpdate(
         {_id:userId},
         { $push: { EmployeeID: { userId:userId , newCv:fetchUser.avatar}}}
      )
      res.json("succeeded")
   }
})


module.exports = {
    signUp,
    signIn,
    changePassword,
    applyJob
}