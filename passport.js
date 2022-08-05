const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
require('dotenv').config();
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require("./models/user");

passport.use(new LocalStrategy((username, password, cb)=>{
    User.findOne({username: username}, function(err, user){
        if(err){return cb(err)}
     
        if(!user){return cb(null, false, { message: 'Incorrect username or password.' })}

        bcrypt.compare(password, user.password, (err, res)=>{
            if(res){
                return cb(false, user)
            }
            else{
                return cb(err, false, {message: "Incorrect password"} )
            }
        })
    })
}))


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY
}, function(jwtPayload, cb){
  cb(null, jwtPayload)
}))