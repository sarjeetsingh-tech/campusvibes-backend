const User = require('../models/User')
const UserDetail = require('../models/UserDetail')
const CampusDetail = require('../models/CampusDetail')

// Controller function to fetch user profile details
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId)
            .populate('userDetails')
            .populate('campusDetails'); 
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


exports.userDetails = async (req, res) => {
    try {
       console.log(req.user)
        const userDetails = new UserDetail(req.body);
        await userDetails.save();
        const userId = req.user._id; // Assuming you have a valid user ID
        await User.findByIdAndUpdate(userId, { userDetails: userDetails._id });

        return res.status(200).json({
            success: true,
            message: 'User details saved successfully',
            redirectURL: '/events',
            userDetails: userDetails
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
exports.campusDetails = async (req, res) => {
    try {
        const campusDetails = new CampusDetail(req.body);
        console.log(req.body)
        await campusDetails.save();

        // const campusId = req.user._id;
        const campusId = "65fe571efc34c2528f518d19";
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