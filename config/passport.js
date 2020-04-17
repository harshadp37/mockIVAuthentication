var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./../models/user');

// AUTHENTICATE USING PASSPORT LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, done) {
        // GET USER USING EMAIL
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Wrong Credentials.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Wrong Credentials.' });
            }
            if(!user.verified){
                return done(null, false, { message: 'Email ID is not Verified.', verified: false });
            }
            return done(null, user);
        })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// SET USER IN LOCALS
passport.setUser = (req, res, next)=>{
    if(req.isAuthenticated()){
        let user = {
            _id: req.user._id,
            email: req.user.email
        }
        res.locals.user = user;
    }
    next();
}

module.exports = passport;