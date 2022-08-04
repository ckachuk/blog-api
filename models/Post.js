
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {type: String, required: true, minLength: 3 },
    body: {type: String, required: true},
    publish: {type: Boolean, required: true},
    category: [{type: Schema.Types.ObjectId, ref:'Category', required:true}]
});

PostSchema
.virtual('url')
.get(function () {
  return '/post/' + this._id;
});


module.exports = mongoose.model('Post', PostSchema)