const express = require("express");
const common = require("../util/common")
const router = express.Router();


router.get("/companies",common.allCompanies)

router.get("/jobs",common.allJobs)

router.get("/users",common.allUsers)

//forget password
router.post("/forget-password",common.forgertPassword)

router.post("/reset-password/:token",common.resetPassword)

// router.get("/Jobby/reset-password/:token",common.resetPassword)
module.exports = router;