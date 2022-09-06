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

router.post('/api/posts/unpublished', passport.authenticate('jwt', {session: false}), postController.getPostsUnpublishAuthor);

router.post('/api/post', passport.authenticate('jwt', {session: false}), postController.createPost);

router.get('/api/post/:postid', postController.getPost);

router.post('/api/post/:postid', passport.authenticate('jwt', {session: false}), postController.updatePost);

router.delete('/api/post/:postid', passport.authenticate('jwt', {session: false}), postController.deletePost);

router.post('/api/post/:postid/comment', passport.authenticate('jwt', {session: false}), postController.createComment);

router.delete('/api/post/:postid/comment/:commentid', passport.authenticate('jwt', {session: false}), postController.deleteComment);


//category routes

router.get('/api/categories', categoryController.getCategories);

router.post('/api/category', passport.authenticate('jwt', {session: false}), categoryController.createCategory);

router.delete('/api/category/:id', passport.authenticate('jwt', {session: false}), categoryController.deleteCategory);

router.get('/api/category/:id', categoryController.getAllPostsOfCategory)


//auth routes

router.post('/api/login', authController.postLogin);

router.post('/api/signup', authController.postSignUp);

//privileges routes

router.post('/api/privilege/admin', passport.authenticate('jwt', {session: false}), privilegeController.becomeAdmin);

router.post('/api/privilege/author', passport.authenticate('jwt', {session: false}), privilegeController.becomeAuthor);

//user routes

router.get('/api/user/:id', userController.getUser)


module.exports = router;
