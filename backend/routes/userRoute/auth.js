const express = require("express");
const userController = require("../../controller/userController")
const router = express.Router();
const multer = require("multer");

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
router.post("/signIn_user",userController.signIn)
router.post("/signUp_user",upload.single("avatar"),userController.signUp)
 // same name request from frontend
 router.put("/changePassword_user",userController.changePassword)



module.exports = router;