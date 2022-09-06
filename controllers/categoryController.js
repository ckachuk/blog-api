var Category = require('../models/category');
var User = require('../models/user');
var Post = require('../models/post')
var {body, validationResult} = require("express-validator");

exports.getCategories = (req, res, next)=>{
   Category.find({}, (err, categories)=>{
    if(err) {return next(err)}
    res.json({status: "OK", message:"all categories", categories: categories})
   })

}


exports.createCategory = [
    body('name', 'Name does not have to be empty').trim().isLength({min:1}).escape(),
    async (req, res, next)=>{
        var errors = validationResult(req.body);

        var category = new Category({
            name: req.body.name
        })

        if(!errors.isEmpty()){
            res.json({status: "FAILED",  message: errors.array()})
        }else{
            User.findById(req.body.currentUserid)
            .populate('credential')
            .exec((err, user)=>{
                if(err){return next(err)}
    
                if(user.credential.isAdmin){
                    category.save((err, category)=>{
                        if(err){return next(err)}
    
                        res.json({status:"OK", message: "The category has been created", category: category})
                    })
                }else{
                    res.json({status:"FAILED", message: "User does not have the permissions"})
                }
            })
        }
    }
]

exports.deleteCategory = (req, res, next)=>{
    User.findOne({id: req.body.currentUserid}) 
    .populate('credential')
    .exec( (err, user)=>{
        if(err){return next(err)}

        if(user.credential.isAdmin){
            Category.findByIdAndDelete(req.params.id, (err)=>{
                if(err){return next(err)}

                res.json({status:"OK", message:"The category has been deleted"})
            })
        }
        else{
            res.json({status:"FAILED", message: "User does not have the permissions"})
        }
    })
   
}

exports.getAllPostsOfCategory = (req, res, next)=>{
    Post.find({"category": {$all:  req.params.id}, publish:true})
    .populate('category')
    .exec((err, posts)=>{
        if(err){ return next(err)}

        res.json({status: "OK", message:"All posts of category", posts:posts});
    })
}