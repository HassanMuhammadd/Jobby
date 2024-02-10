const express = require("express");
const router = express.Router();
const user = require("../../controller/userController")
const token = require("../../Middleware/verifytoken")
const file = require("../../Middleware/upload")
const {  validationResult, body } = require('express-validator')

const validateCVAndImage = [
 
  body('PDF').not().exists().withMessage('CV file is required'),
  body('avatar').not().exists().withMessage('Image file is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];



router.post("/jobs/apply/:id",file.upload.single("avatar"),token.verifyToken,user.applyJob)

router.put("/user/update/:id"
  , file.upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'PDF', maxCount: 1 }]),
  validateCVAndImage, token.verifyToken, user.updateInfo)

// router.put("/updateUserData",file.upload.single("avatar"),token.verifyToken,user.updateInfo)

router.get("/jobs/:id/application",token.verifyToken,user.checkApplied)

module.exports = router