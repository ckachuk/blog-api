
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    body: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref:'User', required:true},
    post: {type: Schema.Types.ObjectId, ref:'Post', required:true}
});

CommentSchema
.virtual('url')
.get(function () {
  return '/comment/' + this._id;
});


module.exports = mongoose.model('Comment', CommentSchema)