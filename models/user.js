var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true, minLength: 3 },
    password: {type: String, required: true, minLength: 8 },
    credential: {type: Schema.Types.ObjectId, ref:'Credential', required:true}
})

UserSchema
.virtual('url')
.get(function () {
  return '/user/' + this._id;
});


module.exports = mongoose.model('User', UserSchema)
