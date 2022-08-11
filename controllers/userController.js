var User = require('../models/user');


exports.getUser = (req, res, next)=>{
    User.findById(req.params.id)
    .populate('credential')
    .exec((err, user)=>{
        if(err){return next(err)}

        if(!user){
            return res.json({status: "OK", message:"User was not found", user:user})
        }

        res.json({status: "OK", message:"User was found", user:user})
    });
}