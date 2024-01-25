const express = require("express");
const router = express.Router();
const user = require("../../controller/userController")
const multer = require("multer");
const token = require("../../Middleware/verifytoken")

// Set up multer middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Specify the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName); // Set the filename
    },
  });
  
const fileFilter = (req,file,cb)=>{
    const fileName = file.mimetype.split("/")[0];
    if(fileName==="image" || file.mimetype==="application/pdf"){
        return cb(null,true);
    }
    else{
        return cb(new Error("Invalid file type"),false);
    }
}
const upload = multer({
    storage:storage,
    fileFilter
})
// old route
router.post("/applyJob/:id",upload.single("avatar"),token.verifyToken,user.applyJob)
router.post("/updateUserData",upload.single("avatar"),token.verifyToken,user.updateInfo)
router.put("/updateUserData",upload.single("avatar"),token.verifyToken,user.updateInfo)
router.get("/checkaApply/:id",token.verifyToken,user.checkApplied)
module.exports = router