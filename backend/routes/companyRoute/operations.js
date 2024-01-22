const express = require("express");
const router = express.Router();
const companyController = require("../../controller/companyController")
const token = require("../../Middleware/verifytoken")
const multer = require("multer")

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


router.post("/addJob",token.verifyToken,companyController.addJob)
router.post("/updateCompanyData",upload.single("avatar"),token.verifyToken,companyController.updateInfo)


module.exports = router;