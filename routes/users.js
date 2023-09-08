const express = require("express");
const controllers = require("../controllers/usersControllers");
const { authintificate, upload } = require('../middlewares');
const router = express.Router();


router.post("/signup", controllers.signupController);
router.post("/login", controllers.loginController);
router.post('/logout', authintificate, controllers.logoutControllers);
router.get('/current', authintificate, controllers.currentControllers);
router.patch('/avatar', authintificate, upload.single("avatar"), controllers.updateAvatar);

module.exports = router;
