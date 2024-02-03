const express = require("express");
const router = express.Router();
const companyController = require("../../controller/companyController")
const multer = require("multer");
const file = require("../../Middleware/upload")


router.post("/signUp_company",file.upload.single("avatar"),companyController.signUp)

router.post("/signIn_company",companyController.signIn)

router.put("/changePassword_company",companyController.changePassword)

module.exports = router;