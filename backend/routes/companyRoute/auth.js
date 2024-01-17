const express = require("express");
const router = express.Router();
const companyController = require("../../controller/companyController")

router.post("/signUp_company",companyController.signUp)
router.post("/signIn_company",companyController.signIn)

module.exports = router;