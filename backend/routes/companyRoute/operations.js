const express = require("express");
const router = express.Router();
const companyController = require("../../controller/companyController")
const token = require("../../Middleware/verifytoken")

const file = require("../../Middleware/upload")


 router.post("/addJob",token.verifyToken,companyController.addJob)

 router.put("/updateCompanyData",file.upload.single("avatar"),token.verifyToken,companyController.updateInfo)

 router.get("/jobs",token.verifyToken,companyController.getJobs)

router.get("/appliedUsers/:id",token.verifyToken,companyController.getUsers)

router.put("/jobs/:jobId/applicants/:userId/validateUser",token.verifyToken,companyController.validateUser)

router.get("/getAllUsers",token.verifyToken,companyController.getAllUsers)

router.get("/jobs/:jobId/applicants/:userId",token.verifyToken,companyController.viewCv)




module.exports = router;