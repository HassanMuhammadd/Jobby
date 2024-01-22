const express = require("express");
const router = express.Router();
const companyController = require("../../controller/companyController")
const token = require("../../Middleware/verifytoken")


router.post("/addJob",token.verifyToken,companyController.addJob)

module.exports = router;