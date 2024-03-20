const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
    address: String,
    city: String,
    state: String,
    zipCode: String,
    dateOfBirth: String,
    gender: String,
    biography: String,
    socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String
    },
    interests: [String],
    employment: {
        company: String,
        position: String
    },
    education: [{
        school: String,
        degree: String,
        fieldOfStudy: String,
        graduationYear: String
    }],
    contact: {
        phone: String,
        alternateEmail: String
    }
});

const UserDetail = mongoose.model('UserDetail', UserDetailsSchema);

module.exports = UserDetail;
