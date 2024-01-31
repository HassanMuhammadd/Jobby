const express = require("express");
const common = require("../util/common")
const router = express.Router();

router.get("/getCompanies",common.allCompanies)

router.get("/getJobs",common.allJobs)

router.get("/getUsers",common.allUsers)

//forget password
router.post("/forgetPassword")

module.exports = router;