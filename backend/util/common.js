const companies = require("../model/company")
const asynchandler = require("express-async-handler");
const job = require("../model/job")


const allCompanies = asynchandler (async(req,res)=>{
    const returnCompoanies = await companies.find();
        // console.log(returnCompoanies)
    return res.json({allCompanies:returnCompoanies})
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
        //  console.log(updatedDocument)
         return updatedDocument
    }
    catch(err){
        res.send("Error while updating data");
    }
}

async function updateStatus(jId, uId, status) {
     
    const userId = uId;
    const jobId = jId;
    // console.log(userId);
    // console.log(jobId)
    const updateStatus = await job.findOneAndUpdate(
      {
         _id: (jobId),
         'employeeIds.userId': (userId)
      },
      {
         $set:{'employeeIds.$.status':status}
      }, 
      {
         new:true
      }
    )
    console.log(updateStatus);
    return updateStatus
}
module.exports = {
    allCompanies,
    updateModelInfo,
    updateStatus
}
