const mongoose = require("mongoose")

const companySchema = new mongoose.Schema ({
    jobIds:[{type:mongoose.Schema.Types.ObjectId, ref:"Job"}],
    userIds:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    retypePassword : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    industry : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    foundationYear: {
        type : Number,
        required : true
    },
    token:{
        type : String,
        required : true
    },
    avatar:{
        type : String
    }
},
   {
    timestamps: true
   }
   )

module.exports = mongoose.model("Company",companySchema)