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
 
    },
  });

const allCompanies = asynchandler (async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * compPerPage;
    const allCompanies = await company.countDocuments();
    const lastPage = Math.ceil(allCompanies / compPerPage);
    
    const returnCompanies = await companies
    .find()
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
     const page = parseInt(req.query.page) || 1;
     const skip = (page - 1) * jobPerPage;
     const allJobs = await job.countDocuments();
     const lastPage = Math.ceil(allJobs / jobPerPage);

     const returnJobs = await job
     .find()
     .skip(skip)
     .limit(jobPerPage);

     res.json({
      allJobs: allJobs,
      curPage: page,
      lastPage: lastPage,
      jobs_in_cur_page: returnJobs,
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

async function updateModelInfo(Model, docId, updatedData, res, file, email, req){
    try{
        const checkEmail = await Model.countDocuments({
            email: updatedData.email
        })
        console.log(checkEmail,email,updatedData.email)
        if(checkEmail==1 && email!=updatedData.email){
            return {error:"This email already exists"}
        }
        if(file){
            updatedData.avatar = file.filename;
        }   
       const updatedDocument = await Model.findOneAndUpdate(
            { _id: docId },
            {$set:{...updatedData} },
            { new : true}
         );
         req.current.email = updatedData.email
         return updatedDocument
    }
    catch(err){
        res.send("Error while updating data");
    }
}

async function updateStatus(jId, uId, status) {
     
    const userId = uId;
    const jobId = jId;
    const updateStatus = await job.findOneAndUpdate(
      {
         _id: (jobId),
         'employeeIds.userId': userId
      },
      {
         $set:{'employeeIds.$.status':status}
      }, 
      {
         new:true
      }
    )
    return updateStatus
}



async function confirmSignUp(email,name){
   //  let mailOptions = {
   //      from: "shopify@gmail.com",
   //      to:email,
   //      subject:"Sign up successful",
   //      text: `Hello ${name}, \n\n Welcome to our platform! You have successfully signed up.  `
   //   }
   //   console.log(email)
   //   try {
   //      const info = await transporter.sendMail(mailOptions);
   //      console.log({ message: 'Signup successful. Welcome email sent.' });
   //      return "succeeded";
   //    } catch (error) {
   //      console.log({ error: 'Error sending welcome email.' ,error});
   //      return "error";
   //    }
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
          console.log(retrieveObject.email)
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
        return res.send("Error while reseting password");
     }
     const hashedPassword = await bcrypt.hash(password,10);
     checkUser.password = hashedPassword;
     checkUser.retypePassword = hashedPassword;
     checkUser.resetToken = '';
     checkUser.resetTokenExpiry = '';

     checkUser.save();
     res.send("password updated successfully");

})



module.exports = {
    allCompanies,
    updateModelInfo,
    updateStatus,
    allJobs,
    allUsers,
    confirmSignUp,
    forgertPassword,
    resetPassword
}
