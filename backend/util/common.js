const mongoose = require("mongoose")
const companies = require("../model/company")
const asynchandler = require("express-async-handler");


const allCompanies = asynchandler (async(req,res)=>{
        const returnCompoanies = await companies.find();
        // console.log(returnCompoanies)
        return res.json({allCompanies:returnCompoanies})
})

module.exports = {
    allCompanies
}