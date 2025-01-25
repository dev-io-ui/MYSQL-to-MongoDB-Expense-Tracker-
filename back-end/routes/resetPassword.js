const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPassword');

router.post('/forgotpassword', resetPasswordController.forgotpassword);
router.get('/resetpassword/:id', resetPasswordController.resetpassword);
router.post('/updatepassword/:resetpasswordid', resetPasswordController.updatepassword);

module.exports = router;














// const express = require("express");
// const router = express.Router();
// const resetPasswordController = require("../controllers/resetPassword");

// router.get('/updatepassword/:resetpasswordid', resetPasswordController.updatepassword)

// router.get('/resetpassword/:id', resetPasswordController.resetpassword)

// router.use('/forgotpassword', resetPasswordController.forgotpassword)

// module.exports = router;