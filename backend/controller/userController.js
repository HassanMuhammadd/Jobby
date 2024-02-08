const asynchandler = require('express-async-handler')
const validator = require("validator");
const user = require("../model/user")
const bcrypt = require("bcrypt");
const generate = require("../util/genToken")
const job = require("../model/job")
const common = require("../util/common")
const mongoose = require('mongoose');
const { userValidation } = require("../Middleware/userValidation");
const { validationResult } = require("express-validator")

const signUp = asynchandler (async(req,res,next) => {

   let { name, email, password, retypePassword, phone, industry, location } = req.body;
    email = email.trim();
    password = password.trim();
    retypePassword = retypePassword.trim();
    req.body.password = password;
    req.body.retypePassword = retypePassword;
    req.body.email = email;
    try{
      await userValidation.validate(req.body)
   } catch(err){
      console.log("All fields are required");
      err.statusCode = 400;
      return next(err);

   }
   console.log("afterr")
   if (!validator.isEmail(email)) {
      const error = new Error("Email is not correct");
      error.statusCode = 400;
      throw error;
   }
    
   const retrieveUser = await user.findOne({email});
   if (retrieveUser) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      throw error;
   }
   
   if (password != retypePassword) {
      const error = new Error("Password does not match");
      error.statusCode = 400;
      throw error;
   }

   let avat, cv;
   if (!req.files['PDF']) {
      const error = new Error("Your CV is required");
      error.statusCode = 400;
      throw error;
   }
   if (!req.files['avatar']) {
      const error = new Error("Your image is required");
      error.statusCode = 400;
      throw error;
   }
   cv = req.files['PDF'][0].path;
   avat = req.files['avatar'][0].filename;
   const encryptedPassword = await bcrypt.hash(password,10);
   const newUser = new user({
      name,
      email,
      password:encryptedPassword,
      retypePassword:encryptedPassword,
      phone,
      industry,
      location,
      avatar:avat,
      cv :cv
   });
   const token = await generate({id:newUser._id,email:newUser.email})
   newUser.token = token;
   const check = await common.confirmSignUp(email, name);
   if (check == "error") {
      const error = new Error("error in signing up");
      error.statusCode = 400;
      throw error;
      
   }
   newUser.save();
   return res.json({User : newUser}); 
})

const signIn = asynchandler (async(req,res,next) => {
   console.log("signIn",res.csrfToken)
     let {email, password} = req.body;
     email = email.trim();
     password = password.trim();
     if(!email || !validator.isEmail(email)){
        return res.json({error:"Email is not correct"});
     }


     const retrieveUser = await user.findOne({email:email.toLowerCase()})
     if(!retrieveUser){
      return res.status(400).json({error:"Email is not correct"});
     }
     const checkPassword = await bcrypt.compare(password,retrieveUser.password);
     if(!checkPassword){
       return res.status(400).json({error:"Password is not correct"});
     }
     const token = await generate({id:retrieveUser._id,email:retrieveUser.email});
     retrieveUser.token = token;
     retrieveUser.save();
     console.log("LoggedIn successfully")
     res.json({User:retrieveUser})
})

const changePassword = asynchandler(async(req,res)=>{

   const {email, oldPassword, newPassword, confirmPassword} = req.body;
   const fetchUser = await user.findOne({email});
   if(!email || !validator.isEmail(email)){
       return res.status(400).json({error:"Email is not found"});
   } 
   const password = fetchUser.password;
   const checkPassword = await bcrypt.compare(oldPassword,password);
   if(!checkPassword){
      return res.status(400).json({error:"Old password is not correct"});
   }
   if(newPassword!==confirmPassword){
      return res.status(401).json({error:"Oops! The passwords you entered don't match. Please try again"});
   }
   const updatedPassword = await bcrypt.hash(newPassword,10);
   const confirmationPassword = await bcrypt.hash(confirmPassword,10);
   fetchUser.password = updatedPassword;
   fetchUser.retypePassword = confirmationPassword;
   fetchUser.save()
   res.json("updated successfully")
})

// first time to apply
const applyJob = asynchandler (async(req,res,next)=>{
   const jobId = (req.params.id);
   const userId = req.current.id;
   console.log(userId)
   if(req.file){
      const newCv = req.file.filename;
      await job.findByIdAndUpdate(
         {_id: jobId},
         {
            $push: { employeeIds: {userId: userId,newCv:newCv}}
         }
      )
    
   }
   else{
      
      const fetchUser = await user.findOne({_id:userId});
      console.log(fetchUser)
      await job.findOneAndUpdate(
         {_id:jobId},
         { $push: { employeeIds: { userId:userId , newCv:fetchUser.avatar}}}
      )
      res.json(fetchUser)
   }
})

const updateInfo = asynchandler(async(req,res,next)=>{
   let { password, retypePassword, email } = req.body;

      console.log("tototot");
      password = password.trim();
      email = email.trim();
      retypePassword = retypePassword.trim();
      if(password!=retypePassword){
         return res.status(400).json({error:"password does not match retype password"});
      }
      req.body.password = password;
      req.body.retypePassword = retypePassword;
      req.body.email = email;
      console.log("in user controller",req.current.email);
      await userValidation.validate(req.body)
      const returnedData = await common.updateModelInfo(user,req.current.id,req.body,res,req.files['PDF'][0].path, req.files['avatar'][0].filename,req.current.email,req)
      res.send(returnedData)
})

const checkApplied = asynchandler(async(req,res)=>{
     const id = new mongoose.Types.ObjectId(req.current.id)
     const jobId = req.params.id;
     const check = await job.find({'employeeIds.userId':id,_id:jobId})  
     console.log("check is ",check[0])
     if(check[0]){
      res.send("already applied")
     }
     else{
       res.send.json({
         state:"didn't apply before"
       })
     }
})


module.exports = {
    signUp,
    signIn,
    changePassword,
    applyJob,
    updateInfo,
    checkApplied
}