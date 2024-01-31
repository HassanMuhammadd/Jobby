const companies = require("../model/company")
const asynchandler = require("express-async-handler");
const job = require("../model/job")
const user = require("../model/user")
const crypto = require("crypto")
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "boodyahmed825@gmail.com",
      pass: "wvzi twzq sfuj gqqt",
    },
  });

const allCompanies = asynchandler (async(req,res)=>{
    const returnCompoanies = await companies.find();
    return res.json({allCompanies:returnCompoanies})
})

const allJobs = asynchandler(async(req,res)=>{
     const returnJobs = await job.find();
     res.json({allJobs:returnJobs})
})

const allUsers = asynchandler(async(req,res)=>{
     const returnUsers = await user.find();
     res.json({allUsers:returnUsers})
})

async function updateModelInfo(Model, docId, updatedData, res, file, email){
    try{
        const checkEmail = await Model.countDocuments({
            email: updatedData.email
        })
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



async function forgertPassword(email){
    let mailOptions = {
        from: "boodyahmed825@gmail.com",
        to:email,
        subject:"Welcome to our company",
        text: 'Thank you for signing up! We are excited to have you on board.'
     }
     console.log(email)
     try {
        const info = await transporter.sendMail(mailOptions);
        console.log({ message: 'Signup successful. Welcome email sent.' });
        return "succeeded";
      } catch (error) {
        console.log({ error: 'Error sending welcome email.' ,error});
        return "error";
      }
}

// const forgertPassword = asynchandler(req,res,next=>{
//      const email = req.body.email;
//      const Model = req.body.user;
//      const resetToken = crypto.randomBytes(20).toString('hex');

//      const user = Model.findOneAndUpdate(
//         {email:email},                                       // 1hr
//         {resetToken:resetToken, resetTokenExpiry:Date.now() + 3600000},
//         {new:true}
//      )
//      if(!user){
//         return res.status(400).json({error:"User not found"})
//      }
//      const mailOptions = {
//         to:user.email,
//         from
//      }


// })

module.exports = {
    allCompanies,
    updateModelInfo,
    updateStatus,
    allJobs,
    allUsers,
    forgertPassword
}
