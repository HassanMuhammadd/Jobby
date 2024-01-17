const asynchandler = require('express-async-handler')
const validator = require("validator");
const user = require("../model/user")
const bcrypt = require("bcrypt");

const signUp = asynchandler (async(req,res,next) => {
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
         location
      });
      console.log(newUser)
      
      const retUser = await newUser.save();
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
     console.log("LoggedIn successfully")
     res.json({User:retrieveUser})
})



module.exports = {
    signUp,
    signIn
}