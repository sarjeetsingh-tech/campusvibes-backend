require('dotenv').config()
const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');
const passport = require('passport');

const mailSender = require('../utils/mailsender');
const { userDetails } = require('./additionalDetails');

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Email in sendOtp controller", email)
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "Email already exists"
            })
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });


        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = OTP.findOne({ otp: otp });
        }
        console.log("OTP generated", otp);

        const createdOtp = OTP({
            email,
            otp
        })
        await createdOtp.save();

        return res.status(200).json({
            success: true,
            message: "OTP created!",
            createdOtp
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.signup = async (req, res) => {
    const { name, email, password, role, mobileNumber, otp } = req.body;

    if (!name || !email || !password || !role) {
        res.status(400).json({
            success: false,
            message: "Fields are missing"
        })
    }

    if (role === 'campus') {
        if (email !== "crssiet@gmail.com") {
            return res.status(400).json({
                success: false,
                message: "Not a valid campus email"
            });
        }
        if (!mobileNumber) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is required for campus"
            });
        }
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(401).json({
            success: false,
            message: "Email already exists"
        })
    }
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);


    if (recentOtp == null) {
        return res.status(400).json({
            success: false,
            message: 'OTP not found'
        })
    }
    else if (otp != recentOtp.otp) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP"
        })
    }

    const newUser = new User({
        name, email, role, mobileNumber
    });

    try {
        await newUser.setPassword(password);
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "Account created successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error creating user account"
        });
    }
}

exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email or Password is Empty',
            });
        }
        const currUser = await User.findOne({ email });
        console.log(currUser);

        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Signin Failure, try again',
                });
            }
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Email or Password is incorrect',
                });
            }

            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Signin Failure, try again',
                    });
                }
                let redirectUrl;
                if (user.role == 'student') {
                    redirectUrl = user.userDetails ? '/events' : '/user/details';
                } else if (user.role = 'campus') {
                    redirectUrl = user.campusDetails ? '/events' : '/campus/details';
                }
                console.log(user);
                return res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    user: user,
                    redirectUrl: redirectUrl
                });
            });
        })(req, res, next);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Signin Failure, try again',
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Checking if the old password matches the one in the database
        const isOldPasswordValid = await user.authenticate(oldPassword);
        if (!isOldPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Old password is incorrect',
            });
        }

        // Setting  new password
        await user.setPassword(newPassword);
        await user.save();
        try {
            const emailResponse = await mailSender(user.email, 'Password Changed',`PASSWORD CHANGE CONFIRMATION`
            );
            console.log(emailResponse);

        } catch (error) {
            console.log("Error occured while sending email :", error)
            return res.status(500).json({
                success: false,
                message: 'Error occured while sending email',
                error: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error changing password',
        });
    }
};



exports.signout = async (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.send("logged out");
    })

}





