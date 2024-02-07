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


// const randomTokenMiddleware = (req, res, next) => {
    
//     // Generate a random token using uuidv4
//     const randomToken = uuidv4();
  
//     // Add the random token to res.locals for easy access in views and routes
//     res.csrfToken = randomToken;
//     console.log("uuidv4", randomToken)
//     // Continue to the next middleware or route handler
//     next();
//   };


app.use(express.json({limit:'500kb'}));  // security reason (to limit the req body size)
app.use('/uploads',express.static(path.join(__dirname,"uploads")));



app.use(helmet());  
// app.use(randomTokenMiddleware);


app.use(user);
app.use(company)
app.use(shared);
app.use(companyOperations)
app.use(userOperation)

app.use(function (err, req, res, next) {
    res.status(400).json({message: err.message})
})


app.listen(4000,()=>{
    console.log("here");
});
