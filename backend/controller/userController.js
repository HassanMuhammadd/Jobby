const asynchandler = require('express-async-handler')
const validator = require("validator");
const user = require("../model/user")
const bcrypt = require("bcrypt");
const generate = require("../util/genToken")
const job = require("../model/job")
const common = require("../util/common")
const yup = require("yup");
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const sendGrid = require("nodemailer-sendgrid-transport")



const userValidation = yup.object({
   name: yup.string().required(),
   email: yup.string().required(),
   password: yup.string()
   .min(6,'Password must be at least 6 characters long')
   .required('Password is required'),

   retypePassword: yup.string().required(),
   phone: yup.string().required(),
   industry: yup.string().required(),
   location: yup.string().required()
   
})


const signUp = asynchandler (async(req,res,next) => {

    let {name,email,password,retypePassword,phone,industry,location} = req.body;
    email = email.trim();
    password = password.trim();
    retypePassword = retypePassword.trim();
    try{
      await userValidation.validate(req.body)
   } catch(err){
      console.log("All fields are required");
      return res.json({error:err.message});
   }
      if(!validator.isEmail(email)){
         return res.json({error:"Email is not correct"});
      }
    
      const retrieveUser = await user.findOne({email});
      if(retrieveUser){
         return res.json({error:"Email already exists"})
      }
      
      if(password!=retypePassword){
         return res.json({error:"Password does not match"})
      }
   
      let avat, cv;
      if(!req.files['PDF']){
         return res.send("Your CV is required");
      }
      if(!req.files['avatar']){
         return res.send("Your image is required");
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
      if(check=="error"){
         return res.send("error in signing up");
      }
      newUser.save();
      return res.json({User : newUser}); 
})

const signIn = asynchandler (async(req,res,next) => {
     let {email, password} = req.body;
     email = email.trim();
     password = password.trim();
     if(!email || !validator.isEmail(email)){
        return res.json({error:"Email is not correct"});
     }


     const retrieveUser = await user.findOne({email:email.toLowerCase()})
     if(!retrieveUser){
      return res.json({error:"Email is not correct"});
     }
     const checkPassword = await bcrypt.compare(password,retrieveUser.password);
     if(!checkPassword){
       return res.json({error:"Password is not correct"});
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
     const returnedData = await common.updateModelInfo(user,req.current.id,req.body,res,req.file,req.current.email)
     res.send(returnedData)
})

const checkApplied = asynchandler(async(req,res)=>{
     const id = new mongoose.Types.ObjectId(req.current.id)
     const jobId = req.params.id;
     const check = await job.find({'employeeIds.userId':id,_id:jobId})  // needs optimization
     console.log("check is ",check[0])
     if(check[0]){
      res.send("already applied")
     }
     else{
       res.send("didn't apply before")
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