const express = require("express");
const controllers = require("../controllers/usersControllers");

const router = express.Router();

router.post("/signup", controllers.signupController);
router.post("/login", controllers.loginController);
router.post("/logout");
router.get("/current");

module.exports = router;
