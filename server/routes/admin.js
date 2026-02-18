// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/adminController");

// router.post("/login", controller.loginAdmin);

// module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController");

router.post("/login", controller.loginAdmin);

module.exports = router;
