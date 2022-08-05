var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');
var categoryController = require('../controllers/categoryController');
var authController = require('../controllers/authController')
var privilegeController = require('../controllers/privilegeController')
const passport = require('passport');


//posts routes

router.get('/api/posts/published', passport.authenticate('jwt', {session: false}), postController.getAllPosts);

router.get('/api/posts/unpublished', postController.getPostsUnpublishAuthor);

router.post('/api/post', postController.createPost);

router.get('/api/post/:id', postController.getPost);

router.post('/api/post/:id', postController.updatePost);

router.delete('/api/post/:id', postController.deletePost);

router.post('/api/post/:id/comment', postController.createComment);

router.delete('/api/post/:id/comment/:id', postController.deleteComment);


//category routes

router.get('/api/categories', categoryController.getCategories);

router.post('/api/category', categoryController.createCategory);

router.post('/api/category/:id', categoryController.deleteCategory);

router.get('/api/category/:id/posts', categoryController.getAllPostsOfCategory)


//auth routes

router.post('/api/login', authController.postLogin);

router.post('/api/signup', authController.postSignUp);

//privileges routes

router.post('/api/privilege/admin', privilegeController.becomeAdmin);

router.post('/api/privilege/author', privilegeController.becomeAuthor);



module.exports = router;
