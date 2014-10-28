var database  = require('mongoose');
var User     = database.model('User');

module.exports = listUsers;
function listUsers(cb) {
  Users.find({ }, cb);
}
