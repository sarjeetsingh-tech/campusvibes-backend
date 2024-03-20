const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ['student', 'campus'],
    required: true
  },
  mobileNumber: {
    type: String,
    required: function () {
      return this.role === 'campus';
    }
  },
  userDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetail'
  },
  campusDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CampusDetail'
  }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);

module.exports = User;
