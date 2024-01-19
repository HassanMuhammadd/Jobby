const express = require("express");
const common = require("../util/common")
const router = express.Router();

router.get("/getCompanies",common.allCompanies)
module.exports = router;