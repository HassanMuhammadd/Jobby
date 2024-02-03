const express = require("express");
const userController = require("../../controller/userController")
const router = express.Router();
const file = require("../../Middleware/upload")


router.post("/signIn_user",userController.signIn)

router.post("/signUp_user",file.upload.fields([{name:'avatar',maxCount:1} , 
                                               {name:'PDF' , maxCount:1}]),userController.signUp)

// same name request from frontend
router.put("/changePassword_user",userController.changePassword)



module.exports = router;