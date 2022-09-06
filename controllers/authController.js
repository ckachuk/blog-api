const passport = require("passport");
const jwt = require('jsonwebtoken');
var {body, validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
var User = require('../models/user');
var Credential = require('../models/credential') 
require('dotenv').config();

exports.postLogin = (req, res, next)=>{
    passport.authenticate("local",{session:false}, (err, user)=>{
        
        if(err || !user){
            res.status(401).json({
                status: "FAILED",
                message: "Incorrect Username or Password",
                user
            });
        }
        
        jwt.sign({_id: user._id, username: user.username}, process.env.JWT_KEY, {expiresIn: "24hr"}, (err, token)=>{
            if(err){return res.status(401).json(err)}

            res.json({
                status: "OK",
                token: token,
                user: {_id: user._id, username: user.username},
            })
        })
    })(req,res)
}


exports.postSignUp = [
    body('username', "Username must not be less than 3 characters.").trim().isLength({min: 3}).escape(),
    body('password', "Paswword must not be less than 8 characters.").trim().isLength({min: 8}).escape(),
    async (req, res, next)=>{
        var errors = validationResult(req.body);

        var credential = new Credential({
            isAdmin: false,
            isAuthor: false
        });

        var user = new User({
            username: req.body.username,
            password: req.body.password,
            credential:  credential._id
        });

        if(!errors.isEmpty()){
            res.json({status: "FAILED",  message: errors.array()})
        }
        else{
            const usernameCount = await User.countDocuments({username: req.body.username});
            
            if(usernameCount > 0){
                res.json({status: "FAILED",  message: 'The username has been used'})
            }
            else{
                credential.save((err)=>{
                    if(err){ return next(err)}
                });  
                
                const salt = await bcrypt.genSalt(10);
    
                user.password = await bcrypt.hash(user.password, salt);
                
                
                user.save((err)=>{
                    if(err){ return next(err)}
    
                    res.json({status: "OK", message:"The user has been created"})
                });
            }
            }
            

    }
]
