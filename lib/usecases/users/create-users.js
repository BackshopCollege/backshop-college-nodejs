
var Joi       = require('joi');
var User      = require('mongoose').model('User');

module.exports = createUser;

function createUser(newUserFields, cb) {

  validateUserFields(newUserFields, verified);

  function verified(err, fields) {
    if(err) { return cb(err); }

    var user = new User(newUserFields);
    user.save(callbacked);

    function callbacked(err) {
      if(err) { return cb(err); } 
      cb(null, user);
    }
  }
}

function validateUserFields(value, cb) {
  var schema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    username: Joi.string().required()
  }).required();

  Joi.validate(value, schema, cb);
}
