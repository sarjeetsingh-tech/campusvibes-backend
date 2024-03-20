const User = require('../models/User')
const UserDetail = require('../models/UserDetail')
const CampusDetail = require('../models/CampusDetail')


exports.userDetails = async (req, res) => {
    try {
        const userDetails = new UserDetail(req.body);
        await userDetails.save();

        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { userDetails: userDetails._id });

        return res.status(200).json({
            success: true,
            message: 'User details saved successfully',
            redirectURL:'/events',
            userDetails: userDetails
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}
exports.campusDetails = async (req, res) => {
    try {
        const campusDetails = new CampusDetail(req.body);
        await campusDetails.save();

        const campusId = req.user._id;
        await User.findByIdAndUpdate(campusId, { campusDetails: campusDetails._id });
        return res.status(200).json({
            success: true,
            message: 'Campus details saved successfully',
            redirectURL:'/dashboard',
            campusDetails: campusDetails
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}