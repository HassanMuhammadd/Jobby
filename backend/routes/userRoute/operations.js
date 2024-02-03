const express = require("express");
const router = express.Router();
const user = require("../../controller/userController")
const token = require("../../Middleware/verifytoken")
const file = require("../../Middleware/upload")



router.post("/applyJob/:id",file.upload.single("avatar"),token.verifyToken,user.applyJob)

router.put("/updateUserData",file.upload.fields([{name:'avatar',maxCount:1} , 
                             {name:'PDF' , maxCount:1}]),token.verifyToken,user.updateInfo)

// router.put("/updateUserData",file.upload.single("avatar"),token.verifyToken,user.updateInfo)

router.get("/checkaApply/:id",token.verifyToken,user.checkApplied)

module.exports = router