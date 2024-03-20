const express = require('express');
const passport = require('passport');
const { signup, sendOtp, signin, signout, changePassword } = require('../controllers/Auth');
const router = express.Router();

router.post('/signup', signup)
router.post('/sendotp', sendOtp)
router.post('/signin', signin)
router.post('/changepassword', changePassword);
router.post('/signout', signout)


router.get('/temp', (req, res) => {
    console.log(req.isAuthenticated());
    if (!req.isAuthenticated()) res.send("login first !!");
    else
        res.send('temporary page --- Accessible to only authenticated user');
})

module.exports = router;