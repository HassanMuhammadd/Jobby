const express = require("express");
const router = express.Router();
const companyController = require("../../controller/companyController")
const file = require("../../Middleware/upload")
const rateLimit = require("express-rate-limit");
const { check, validationResult } = require("express-validator");

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: 
    ` <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rate Limit Exceeded</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f8f9fa;
          color: #343a40;
          text-align: center;
          padding: 50px;
        }
        h1 {
          color: #dc3545;
        }
        p {
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <h1>Rate Limit Exceeded</h1>
      <p>
        Too many requests from this IP. Please try again later.
      </p>
    </body>
    </html>
   ` 
    
})

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


router.post("/companies/signup", limiter, file.upload.single("avatar"), validateImage ,companyController.signUp)

router.post("/companies/signin",limiter,companyController.signIn)


module.exports = router;