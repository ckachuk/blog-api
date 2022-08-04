
module.exports.getCategories = (req, res, next)=>{
    res.json({message: "GET ALL CATEGORIES"})
}


module.exports.createCategory = (req, res, next)=>{
    res.json({message: "CREATE CATEGORY"})
}

module.exports.deleteCategory = (req, res, next)=>{
    res.json({message: "DELETE CATEGORY"})
}

module.exports.getAllPostsOfCategory = (req, res, next)=>{
    res.json({message: "GET ALL POSTS OF CATEGORY"})
}