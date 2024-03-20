if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()

}
const express = require('express');
const app = express();

//models
const User = require('./models/User');

//routes
const userRoute = require('./routes/user')
const additionalDetailsRoute = require('./routes/additionalDetails')
const eventRoute = require('./routes/event')

//cloudinary
const cloudinary = require('cloudinary');
cloudinary.v2.config({
    cloud_name: 'dsgzsnnzy',
    api_key: '171392762477726',
    api_secret: 'hIUpTZxjJ9wxDRSIkORVu22wh0E',
    secure: true,
});


const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/campusVibes')
    .then(() => console.log('connected'))
    .catch(err => console.log('connection error'))

const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))



const session = require('express-session');
const passport = require('passport');
// Configure session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Change to true if using HTTPS
        expires: new Date(Date.now() + 1000 * 60 * 60),
        maxAge: 1000 * 60 * 60, // or expires: new Date(Date.now() + 1000 * 60 * 60)
        httpOnly: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser(function (user, done) {
    const serializedUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userDetails: user.userDetails,
        campusDetails: user.campusDetails

    };
    done(null, serializedUser);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});



const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));


app.use('/', userRoute);
app.use('/', additionalDetailsRoute);
app.use('/', eventRoute)

app.listen(process.env.PORT, () => {
    console.log("listening at port 3000");
})