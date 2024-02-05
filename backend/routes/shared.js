const express = require("express");
const common = require("../util/common")
const router = express.Router();
const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 mins
    max: 5 ,//requests
    message:
    `
    <!DOCTYPE html>
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


router.get("/companies",common.allCompanies)

router.get("/jobs",common.allJobs)

router.get("/users",common.allUsers)

//forget password
router.post("/forget-password",limiter,common.forgertPassword)

router.post("/reset-password/:token",common.resetPassword)

// router.get("/Jobby/reset-password/:token",common.resetPassword)
module.exports = router;