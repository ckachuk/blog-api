var Post = require('../models/post');
var User = require('../models/user');
var async = require('async');
var Comment = require('../models/comment');
var {body, validationResult} = require("express-validator");
var _ = require('lodash');

exports.getAllPublishPosts = (req, res, next)=>{
    Post.find({publish:true})
    .populate('category')
    .exec((err, posts)=>{
        if(err){return next(err)}

        if(posts.length === 0){
            return res.json({ status:"OK", message:"The blog has no entries"});
        }

        res.json({status: "OK", message:"Blog posts", posts: posts});
    });
}

exports.getPost = (req, res, next)=>{
    async.parallel({
        post: function(callback){
            Post.findById(req.params.postid)
            .populate('category')
            .populate('user')
            .exec(callback)
        },
        comments: function(callback){
            Comment.find({post: req.params.postid})
            .populate('user')
            .exec(callback);
        } 
    }, (err, results)=>{
        if(err){return next(err)}
              
        if(!results.post){
            return res.json({status: "OK", message:"Post does not exist"})
        }
        
        res.json({status: "OK", message:"Post", post: results.post, comments: results.comments})
    })
   
}

exports.createPost =[ 
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.genre ==='undefined')
            req.body.category = [];
            else
            req.body.category = new Array(req.body.category);
        }
        next();
    },
    body('title', "Title must not be less than 3 characters.").trim().isLength({min: 3}).escape(),
    body('body', 'Body does not have to be empty').trim().isLength({min:1}).escape(),
    body('catgory.*').escape(),
    (req, res, next) =>{
        var errors = validationResult(req.body);

        var post = new Post({
            title: req.body.title,
            body: req.body.body,
            publish: false,
            user: req.body.currentUserid,
            category: req.body.category,
            date_created: new Date().toISOString()
        })
        if(!errors.isEmpty()){
            return res.json({status:"FAILED", message: errors.array()})
        }
        else{
            User.findById(req.body.currentUserid)
            .populate('credential')
            .exec((err, user)=>{
                if(err){return next(err)}

                if(user.credential.isAuthor){
                    post.save((err, post)=>{
                        if(err){ return next(err)}
                        res.json({status: "OK", message: "The post has been created", post:post})
                    })
                }else{
                    return res.json({status: "FAILED AUTHENTICATION", message: "User does not have the permission"});
                }
            })
        }
    }
]

exports.updatePost = [
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category ==='undefined')
            req.body.category = [];
            else
            req.body.category = new Array(req.body.category);
        }
        next();
    },
    body('title', "Title must not be less than 3 characters.").trim().isLength({min: 3}).escape(),
    body('body', 'Body does not have to be empty').trim().isLength({min:1}).escape(),
    body('category.*').escape(),
    (req, res, next) =>{
        var errors = validationResult(req.body);

        var post = new Post({
            title: req.body.title,
            body: req.body.body,
            publish: req.body.publish,
            user: req.body.currentUserid,
            category: (typeof req.body.category==='undefined') ? [] : req.body.category,
            date_created: req.body.date_created,
            _id: req.params.postid
        })
        if(!errors.isEmpty()){
            return res.json({status:"FAILED", message: errors.array()})
        }
        else{
            User.findById(req.body.currentUserid)
            .populate('credential')
            .exec((err, user)=>{
                if(err){return next(err)}

                if(user.credential.isAuthor){
                    Post.findByIdAndUpdate(req.params.postid, post, {}, (err, thepost)=>{
                        if(err){return next(err)}

                        res.json({status:"OK", message: "The post has been updated", post: thepost})
                    })
                }else{
                    return res.json({status: "FAILED AUTHENTICATION", message: "User does not have the permission"});
                }
            })
        }
    }
]


exports.deletePost = (req, res, next) =>{
    async.parallel({
        user: function(callback){
            User.findOne({id: req.body.currentUserid}) 
            .populate('credential')
            .exec(callback)
        },
        post: function(callback){
            Post.findById(req.params.postid)
            .exec(callback)
        }
    }, ((err, results)=>{
        if(err){return next(err)}
        if(_.isEqual(results.user._id, results.post.user) || results.user.credential.isAdmin){

            Post.findByIdAndDelete(req.params.postid, (err)=>{
                if(err){return next(err)}
                Comment.deleteMany({post: req.params.postid}, (err)=>{
                    if(err){return next(err)}
                })
                res.json({status: "OK", message: "The post has been deleted"})
            })
        }
        else{
           return res.json({status: "FAILED", message: "The user does not have the permission"})
        }
    }))
   
}


exports.createComment =[
    body('body', 'Body does not have to be empty').trim().isLength({min:1}).escape(),
    (req, res, next)=>{
        var errors = validationResult(req.body);

        var comment = new Comment({
            body: req.body.body,
            user: req.body.currentUserid,
            post: req.params.postid,
            date_created: new Date().toISOString()
        })

        if(!errors.isEmpty()){
            res.json({status: "FAILED", message: errors.array()})
        }
        else{
            comment.save((err, comment)=>{
                if(err){return next(err)}

                res.json({status:"OK", message:"The comment has been created", comment: comment})
            })
        }
    }
]

exports.deleteComment = (req, res, next) =>{
    async.waterfall([
        function(callback){
            User.findById(req.body.currentUserid)
            .populate('credential')
            .exec((err, user)=>{
                if(err){return next(err)}
                callback(null, user)
            })
        },
        function(user, callback){
            Comment.findById(req.params.commentid, (err, comment)=>{
                if(err){return next(err)}
                callback(null, user, comment)
            })
        },
        function(user, comment, callback){
            if(user.credential.isAdmin || _.isEqual(user._id , comment.user)){
                Comment.findByIdAndDelete(req.params.commentid, (err)=>{
                    if(err){return next(err)}

                    callback(null, 'complete')
                })
            }
            else{
                res.json({status:"FAILED", message: "User does not have the permission"})
            }
        }
    ], (err, result)=>{
        if(err){return next(err)}

        if(result === 'complete'){
            res.json({status:"OK", message: "The comment has been deleted"})
        }else{
            res.json({status:"FAILED", message: "Something bad happened"})
        }
    })
}

exports.getPostsUnpublishAuthor = (req, res, next) =>{

    async.series({
        user: function(callback){
            User.findById(req.params.userid)
            .populate('credential')
            .exec(callback)
        },
        posts: function(callback){
            Post.find({user: req.params.userid, publish: false})
            .populate('category')
            .exec(callback)
        }
    }, ((err, results)=>{
        if(err){return next(err)}
        
        if(results.user.credential.isAuthor){
            if(results.posts.length === 0){
                return res.json({ status:"OK", message:"The user has no entries in unpublish posts"});
            }
    
            res.json({status: "OK", message:"Unpublish posts", posts: results.posts})
        }else{
            return res.json({status:"FAILED NOT AUTHOR", message: "The user is not an author"})
        }
    }))
    
}