const companies = require("../model/company")
const asynchandler = require("express-async-handler");
const user = require("../model/user")


const allCompanies = asynchandler (async(req,res)=>{
    const returnCompoanies = await companies.find();
        // console.log(returnCompoanies)
    return res.json({allCompanies:returnCompoanies})
})

async function updateModelInfo(Model, docId, updatedData, res, file){
    try{
        const checkEmail = await Model.countDocuments({
            email: updatedData.email
        })
        if(checkEmail==2){
            return res.status(400).json("This email already exists")
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
module.exports = {
    allCompanies,
    updateModelInfo
}
