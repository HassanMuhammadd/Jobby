const express = require("express");
const router = express.Router();
const companyController = require("../../controller/companyController")
const multer = require("multer");
const file = require("../../Middleware/upload")


router.post("/companies/signup",file.upload.single("avatar"),companyController.signUp)

router.post("/companies/signin",companyController.signIn)

router.put("/companies/change-password",companyController.changePassword)

module.exports = router;