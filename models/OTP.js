const mongoose=require('mongoose');
const mailSender=require('../utils/mailsender')
const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 1000 * 60 * 5, 
	},
});

async function sendVerificationOTP(email, otp) {
    try {
        const mailResponse = await mailSender(email,
			"Verification Email",
			otp)
        console.log("Email sent Successfully: ", mailResponse.response);
    } catch (error) {
        console.log("error occured while sending mails: ", error);
        throw error;
    }
}

OTPSchema.pre("save", async function (next) {
    console.log("Mail in pre hook", this.email)
    await sendVerificationOTP(this.email, this.otp);
    next();
}) 

module.exports = mongoose.model("OTP", OTPSchema);