
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

var SALT_WORK_FACTOR = 10;

var UsersSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  name:     { type: String, required: true },
  password: { type: String, required: true }
});

UsersSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UsersSchema
  .virtual('isLocked')
  .get(isLocked);

function isLocked() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
}


UsersSchema.methods.comparePassword = comparePassword;
function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, verify);
  
  function verify(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  }
}

module.exports = mongoose.model('User', UsersSchema);
