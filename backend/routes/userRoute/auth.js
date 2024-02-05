const express = require("express");
const userController = require("../../controller/userController")
const router = express.Router();
const file = require("../../Middleware/upload")


router.post("/users/signin",userController.signIn)

router.post("/users/signup",file.upload.fields([{name:'avatar',maxCount:1} , 
                                               {name:'PDF' , maxCount:1}]),userController.signUp)

// same name request from frontend
router.put("/users/change-password",userController.changePassword)



module.exports = router;