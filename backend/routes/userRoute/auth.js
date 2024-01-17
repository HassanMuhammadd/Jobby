const express = require("express");
const userController = require("../../controller/userController")
const router = express.Router();

router.post("/signIn_user",userController.signIn)
router.post("/signUp_user",userController.signUp),



module.exports = router;