const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema ({
    employeeIds:[{userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
                  status: {type:String, default:"pending"},
                  newCv: {type:String}
                  }],
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required : true
    },
    name : {
        type : String,
        required : true
    },
    category: {
        type : String,
        required : true
    },
    salary : {
        type : Number,
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
    experience : {
        type : String,
        required : true
    },
    type : {
        type : String,
        required : true
    }
    
},
  {
    timestamps: true
  }
)

module.exports = mongoose.model("Job",jobSchema)