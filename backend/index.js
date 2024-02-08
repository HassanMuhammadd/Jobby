const mongoose = require("mongoose");
const express = require("express");
const app = express();
const helmet = require("helmet");
const { v4: uuidv4 } = require('uuid');


const user = require("./routes/userRoute/auth");
const company = require("./routes/companyRoute/auth")
const shared = require("./routes/shared")
const companyOperations = require("./routes/companyRoute/operations")
const userOperation = require("./routes/userRoute/operations")
const path = require("path")


const url = "mongodb+srv://boodyahmed:Boody123456777@cluster0.a0vxcji.mongodb.net/Jobby";

mongoose.connect(url).then(()=>{
   console.log("conntected to Jobby database")
})




app.use(express.json({limit:'500kb'}));  // security reason (to limit the req body size)
app.use('/uploads',express.static(path.join(__dirname,"uploads")));



app.use(helmet());  



app.use(user);
app.use(company)
app.use(shared);
app.use(companyOperations)
app.use(userOperation)

app.use(function (err, req, res, next) {
    statusCode = err.statusCode || 500;
    res.status(statusCode).json({message: err.message})
})


app.listen(4000,()=>{
    console.log("here");
});
