const mongoose = require("mongoose");

const userSchema = new mongoose.Schema ({
    jobIds : [{type : mongoose.Schema.Types.ObjectId, ref : "Job"}],
    companyIds:[{type:mongoose.Schema.Types.ObjectId, ref:"Company"}],
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
    avatar :{
        type:String
    },
    token : {
        type:String,
        required : true
    }
    
},
{
    timestamps: true
}
)

module.exports = mongoose.model("User",userSchema)