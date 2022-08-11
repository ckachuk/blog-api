var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');
var categoryController = require('../controllers/categoryController');
var authController = require('../controllers/authController');
var privilegeController = require('../controllers/privilegeController');
var userController = require('../controllers/userController')
const passport = require('passport');


//posts routes

router.get('/api/posts/published', postController.getAllPublishPosts);

router.get('/api/posts/unpublished',  passport.authenticate('jwt', {session: false}), postController.getPostsUnpublishAuthor);

router.post('/api/post', postController.createPost);

router.get('/api/post/:postid', postController.getPost);

router.post('/api/post/:postid', postController.updatePost);

router.delete('/api/post/:postid', postController.deletePost);

router.post('/api/post/:postid/comment', postController.createComment);

router.delete('/api/post/:postid/comment/:commentid', postController.deleteComment);


//category routes

router.get('/api/categories', categoryController.getCategories);

router.post('/api/category', categoryController.createCategory);

router.delete('/api/category/:id', categoryController.deleteCategory);

router.get('/api/category/:id', categoryController.getAllPostsOfCategory)


//auth routes

router.post('/api/login', authController.postLogin);

router.post('/api/signup', authController.postSignUp);

//privileges routes

router.post('/api/privilege/admin',  privilegeController.becomeAdmin);

router.post('/api/privilege/author', privilegeController.becomeAuthor);

//user routes

router.get('/api/user/:id', userController.getUser)


module.exports = router;
