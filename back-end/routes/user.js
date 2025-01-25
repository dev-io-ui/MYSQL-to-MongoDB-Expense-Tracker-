const express = require('express');
const User = require('../models/user');
const userController = require('../controllers/user');
const userAuthentication = require("../middleware/auth");

const router = express.Router();

router.get("/user/isPremiumUser", userAuthentication.authenticate, userController.isPremiumUser);
router.get("/user/getAllUsers", userController.getAllUsers);

router.post('/user/sign-up', userController.postUserSignUp);
router.post('/user/login', userController.postUserLogin);


module.exports = router;
