const asynchandler = require('express-async-handler')
const validator = require("validator");
const user = require("../model/user")
const bcrypt = require("bcrypt");
const generate = require("../util/genToken")


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

      const encryptedPassword = await bcrypt.hash(password,10);
      const newUser = new user({
         name,
         email,
         password:encryptedPassword,
         retypePassword:encryptedPassword,
         phone,
         industry,
         location,
         // avatar:req.file.fieldname
      });
      const token = await generate({id:newUser._id})
      newUser.token = token;
      // console.log(newUser)
      
      const retUser = newUser.save();
      res.json({User : retUser}); 
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


module.exports = {
    signUp,
    signIn,
    changePassword
}