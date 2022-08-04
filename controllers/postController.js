

module.exports.getAllPosts = (req, res, next)=>{
    res.json({message: "GET ALL POSTS"})
}

module.exports.getPost = (req, res, next)=>{
    res.json({message: `GET ${req.params.id} POST`})
}

module.exports.createPost = (req, res, next) =>{
    res.json({message: "CREATE A NEW POST"})
}

module.exports.updatePost = (req, res, next) =>{
    res.json({message: "UPDATE POST"})
}

module.exports.deletePost = (req, res, next) =>{
    res.json({message: "DELETE POST"})
}


module.exports.createComment = (req, res, next) =>{
    res.json({message: "CREATE A NEW COMMENT"})
}

module.exports.deleteComment = (req, res, next) =>{
    res.json({message: "DELETE COMMENT"})
}

module.exports.getPostsUnpublishAuthor = (req, res, next) =>{
    res.json({message: "GET ALL UNPUBLISH POSTS OF THE AUTHOR"})
}