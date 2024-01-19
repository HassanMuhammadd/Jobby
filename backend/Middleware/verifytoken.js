const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) =>{
    console.log("before");
    const authtoken = req.headers["Authorization"] || req.headers["authorization"];
    console.log("after");
    if (!authtoken) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
      }
     const token = authtoken.split(' ')[1];
    //  console.log("tetetetet");
    //  console.log(token);
     const SECRET_KEY = "c4d6f5a7b3e2a1f8e5d2c3a9b6d7e1f4a2b3d6e9f5c8a7b2d4f1e3c5a6b9"
      try{
          const curuser = jwt.verify(token,SECRET_KEY);
          req.current = curuser
          console.log("In verifyToken => ",curuser);
          next();
        //   return returnToken
     
      }
      catch(err){
          res.status(404).json("error decoted token");
      }
}
module.exports = {
    verifyToken
}