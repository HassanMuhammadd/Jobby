const express = require("express");
const router = express.Router();
const companyController = require("../../controller/companyController")
const token = require("../../Middleware/verifytoken")
const { body } = require("express-validator")
const file = require("../../Middleware/upload")
const { check, validationResult } = require("express-validator");

const validateImage = [
 
  check('avatar').not().exists().withMessage('Image file is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];




router.post("/jobs/add", token.verifyToken, companyController.addJob)

router.put("/my-company/update",
 file.upload.single("avatar"),validateImage, token.verifyToken, companyController.updateInfo)

 router.get("/jobs",token.verifyToken,companyController.getJobs)

router.get("/appliedUsers/:id",token.verifyToken,companyController.getUsers)

router.put("/jobs/:jobId/applicants/:userId/validateUser",token.verifyToken,companyController.validateUser)

router.get("/my-company/users",token.verifyToken,companyController.getAllUsers)

router.get("/jobs/:jobId/applicants/:userId",token.verifyToken,companyController.viewCv)




module.exports = router;