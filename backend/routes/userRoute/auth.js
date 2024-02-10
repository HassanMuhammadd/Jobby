const express = require("express");
const userController = require("../../controller/userController")
const router = express.Router();
const file = require("../../Middleware/upload")
const rateLimit = require("express-rate-limit");
const { check, validationResult } = require("express-validator")

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
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

const validateCVAndImage = [
 
  check('PDF').exists().withMessage('CV file is required'),
  check('avatar').exists().withMessage('Image file is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


router.post("/users/signin",limiter,userController.signIn)

router.post("/users/signup",
  limiter, file.upload.fields([{ name: 'avatar', maxCount: 1 }, 
  validateCVAndImage,
                                               {name:'PDF' , maxCount:1}]),userController.signUp)




module.exports = router;