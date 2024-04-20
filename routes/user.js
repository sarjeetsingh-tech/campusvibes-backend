const express = require('express');
const passport = require('passport');
const { signup, sendOtp, signin, signout, changePassword, resetPasswordRequest, resetPassword } = require('../controllers/Auth');
const router = express.Router();
const isAuthenticated=require('../middlewares/isAuthenticated')
const { getUserProfile } = require('../controllers/additionalDetails');


router.get('/user/:userId', getUserProfile);
router.post('/signup', signup)
router.post('/sendotp', sendOtp)
router.post('/signin', signin)
router.post('/changepassword', changePassword);
router.post('/signout', signout)
router.post('/reset-password-request',resetPasswordRequest)
router.post('/reset-password',resetPassword);



router.get('/temp',isAuthenticated, (req, res) => {
    
        res.send('temporary page --- Accessible to only authenticated user');
})


module.exports = router;