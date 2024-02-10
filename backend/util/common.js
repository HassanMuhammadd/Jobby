const companies = require("../model/company")
const asynchandler = require("express-async-handler");
const job = require("../model/job")
const user = require("../model/user")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const company = require("../model/company");

const compPerPage = 4, jobPerPage = 4, empPerPage = 6;

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
       user: "boodyahmed825@gmail.com",
       pass:"wvzi twzq sfuj gqqt"
    },
  });


const buildQuery = (queryParam)=>{
    const query = {};
    Object.entries(queryParam).forEach(([key, value]) => {
      if (key!='page') {
          query[key] = value;
      }
    });
    return query;
 } 

const allCompanies = asynchandler (async(req,res)=>{
    const fields = 'name email industry location description';
    const query = buildQuery(req.query);
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * compPerPage;
    const allCompanies = await company.countDocuments(query);
    const lastPage = Math.ceil(allCompanies / compPerPage);
    const returnCompanies = await companies
    .find(query)
    .select(fields)
    .skip(skip)
    .limit(compPerPage);
      
    return res.json({
      allCompanies: allCompanies,
      curPage: page,
      lastPage: lastPage,
      companies_in_cur_page: returnCompanies
   })
})

const allJobs = asynchandler(async(req,res)=>{
     const fields = 'name description salary companyId';
     const query = buildQuery(req.query);
     const page = parseInt(req.query.page) || 1;
     const skip = (page - 1) * jobPerPage;
     const allJobs = await job.countDocuments(query);
     const lastPage = Math.ceil(allJobs / jobPerPage);

     const returnJobs = await job
     .find(query)
     .select(fields)
     .skip(skip)
     .limit(jobPerPage);

     res.json({
      allJobs: allJobs,
      curPage: page,
      lastPage: lastPage,
      jobs_in_cur_page: returnJobs
   })
})

const allUsers = asynchandler(async(req,res)=>{
     const page = parseInt(req.query.page) || 1;
     const skip = (page - 1) * empPerPage;
     const allEmployees = await user.countDocuments();
     const lastPage = Math.ceil(allEmployees / empPerPage);

     const returnUsers = await user
     .find()
     .skip(skip)
     .limit(empPerPage);

     res.json({
      allUsers: allEmployees,
      curPage: page,
      lastPage: lastPage,
      user_in_cur_page: returnUsers
   })
})


const getCompany = asynchandler(async(req,res) => {
    const compId = req.params.id;
    const Company =  await company.findOne({_id:compId});
    res.status(200).json({
      company:Company
    })
})

const getUser = asynchandler(async(req,res) => {
   const userId = req.params.id;
   const User =  await user.findOne({_id:userId});
   res.status(200).json({
     user:User
   })
})

async function updateModelInfo(Model, docId, updatedData, res, cvFile, avatarFile, email, req){

    try{
       if (Model == user) {
          updatedData.cv = cvFile; 
        }
       if (avatarFile) {
           console.log(avatarFile)
            updatedData.avatar = avatarFile;
       }   
       const updatedDocument = await Model.findOneAndUpdate(
            { _id: docId },
            {$set:{...updatedData} },
            { new : true}
         );

         return updatedDocument
    }
    catch(err){
        res.status(400).send({error:err.message});
    }
}





async function confirmSignUp(email,name){
    let mailOptions = {
        from: "shopify@gmail.com",
        to:email,
        subject:"Sign up successful",
        text: `Hello ${name}, \n\n Welcome to our platform! You have successfully signed up.  `
     }
     try {
        const info = await transporter.sendMail(mailOptions);
        console.log({ message: 'Signup successful. Welcome email sent.' });
        return "succeeded";
      } catch (error) {
        console.log({ error: 'Error sending welcome email.' ,error});
        return "error";
      }
}

const forgertPassword = asynchandler(async(req,res,next)=>{
     const email = req.body.email;
     let Model = req.body.user;
     if(Model=="user"){
        console.log(email);
        Model = user;
     }
     else{
        Model = company
     }
     const resetToken = crypto.randomBytes(20).toString('hex');

     const retrieveObject = await Model.findOneAndUpdate(
        {email:email},                                       // 1hr
        {resetToken:resetToken, resetTokenExpiry:Date.now() + 3600000},
        {new:true}
     )
     if(retrieveObject == undefined){
        return res.status(400).json({error:"User not found"})
     }
     const resetUrl = `http://Jobby/reset-password/${resetToken}`;
     const mailOptions = {
        from:'sho@gmail.com',
        to:retrieveObject.email,
        subject:"Reset password",
        text:`Hello ${retrieveObject.name},\n\nYou have requested a password reset.Click on the following link to reset your password:\n\n
              ${resetUrl}`,
     };
 
    try{
       await transporter.sendMail(mailOptions);
       res.status(200).send("Password reseted successfully");
    }
    catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }

})

const resetPassword = asynchandler(async(req,res,next)=>{
     const password = req.body.password;
     const Model = req.body.user;
     const resetToken = req.params.token;
     let Object;
     if(Model == 'user'){
        Object = user;
     }
     else{
        Object = company;
     }
     const checkUser = await Object.findOne(
        {
           resetToken:resetToken,
           resetTokenExpiry:{$gt : Date.now()} 
        }
     )
     if(!checkUser){
        return res.status(400).send("Error while reseting password");
     }
     const hashedPassword = await bcrypt.hash(password,10);
     checkUser.password = hashedPassword;
     checkUser.retypePassword = hashedPassword;
     checkUser.resetToken = '';
     checkUser.resetTokenExpiry = '';

     checkUser.save();
     res.status(200).send("password updated successfully");

})



module.exports = {
    allCompanies,
    updateModelInfo,
    allJobs,
    allUsers,
    confirmSignUp,
    forgertPassword,
    resetPassword,
    getCompany,
    getUser
}
