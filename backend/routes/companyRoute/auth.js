const express = require("express");
const router = express.Router();
const companyController = require("../../controller/companyController")
const multer = require("multer");
// const fileType = require('file-type');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Specify the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const fileName = `company-${Date.now()}.${ext}`;
        cb(null, fileName); // Set the filename
    },
  });

 const fileFilter = (req,file,cb)=>{
    const fileName = file.mimetype.split("/")[0];
    // const fileTypeResult = fileType(file.buffer);
    if((fileName==="image" || fileName==="application")){
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

router.post("/signUp_company",upload.single("avatar"),companyController.signUp)
router.post("/signIn_company",companyController.signIn)
router.post("/changePassword_company",companyController.changePassword)

module.exports = router;