require('dotenv').config();
var User = require('../models/user');
var Credential = require('../models/credential')


const checkKeyValue = (key, realKey)=>{
    if(key !== realKey){
        return false
    }
    return true;
}

exports.becomeAdmin = (req, res, next)=>{
    if(checkKeyValue(req.body.key, process.env.ADMIN_KEY)){
        User.findById(req.body.currentUserid, (err, user)=>{
            if(err){return next(err)}
    
            if(!user){
                return res.json({status:"FAILED", message: "User could not be found"})
            }
    
            Credential.findByIdAndUpdate(user.credential, {isAdmin: true}, function(err){
                if(err){return next(err)}
    
                res.json({status:"OK", message: "The user has become an admin"})
            })
        })
    }
    else{
        return res.json({status: "FAILED", message: "Key is incorrect"})
    }

    
    
}


exports.becomeAuthor = (req, res, next)=>{
    if(checkKeyValue(req.body.key, process.env.AUTHOR_KEY)){
        User.findById(req.body.currentUserid, (err, user)=>{
            if(err){return next(err)}
    
            if(!user){
                return res.json({status:"FAILED", message: "User could not be found"})
            }
    
            Credential.findByIdAndUpdate(user.credential, {isAuthor: true}, function(err){
                if(err){return next(err)}
    
                res.json({status:"OK", message: "The user has become an author"})
            })
        })
    }
    else{
        return res.json({status: "FAILED", message: "Key is incorrect"})
    }

    
}

