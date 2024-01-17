const company = require("../model/company");
const bcrypt = require("bcrypt");
const validator = require("validator")
const asynchandler = require("express-async-handler");

const signUp = asynchandler(async(req,res)=>{
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
        foundationYear
     });
     
     const retCompany = await newCompany.save();
     res.json({Company : retCompany}); 
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
    console.log("LoggedIn successfully")
    res.json({Company:retrieveCompany})

})

module.exports = {
    signUp,
    signIn
}
