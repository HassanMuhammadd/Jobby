const mongoose = require("mongoose");
const express = require("express");
const app = express();
const user = require("./routes/userRoute/auth");
const company = require("./routes/companyRoute/auth")
const url = "mongodb+srv://boodyahmed:Boody123456777@cluster0.a0vxcji.mongodb.net/Jobby";

mongoose.connect(url).then(()=>{
   console.log("conntected to Jobby database")
})

app.use(express.json());
app.use(user);
app.use(company)


app.use(function (err, req, res, next) {
    res.status(400).json({message: err.message})
})


app.listen(4000,()=>{
    console.log("here");
});