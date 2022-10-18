
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CredentialSchema = new Schema({
    isAuthor:  {type: Boolean, required: true},
    isAdmin:  {type: Boolean, required: true}
});


module.exports = mongoose.model('Credential', CredentialSchema);
