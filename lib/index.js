
/* CONTROLLER */
app.post('/users', CraeteUserController);

function CreateUserController(req, res, next) {

  core.users.create(req.body, callback);
  function callback(err, user) {
    if(err) next();
    res.json(user);
  }
}

/* Core */

var mailer    = require('mailer');
var database  = require('database');
var publisher = require('publisher');

function Core(opts) {

  [ database, 
    publisher,
    mailer
  ].forEach(function boot(component) {   
    component.start(opts);
    component.on('error', function(err) { throw err; });
  }); 

  return {
    users: require('users'),
    
    _store: database,
    _mailer: mailer,
    _publisher: publisher
  };
}

/* Core - Components - Databases */

var mongoose = require('mongoose');
module.exports = Database;

function Database(opts) {
  var uri = opts.databaseOpts.uri;
  
  return { init: init };

  function init(cb) {
    mongoose.connect(uri, cb);
  }
}

/* Core - Users */

function Users(){
  
  return {
    create: require('create-users'),
    list:   require('list-users')
  };
}


/* Core - Users - Create User */

var mailer      = require('mailer');
var store       = require('database')('Users');
var createUserValidation  = require('../validators').create;

var Boom        = require('boom');

module.exports = CreateUser;

function CreateUser(newUser, callback) {
  var ctx = { newUser: newUser };

  var steps = [
    validate,
    createUser,
    sendconfirmationEmail
  ];

  Usecase(ctx, steps, success, error);

  function success(ctx) {
    callback(null, ctx.user);
  }

  function error(err) {
    callback(ErrorHandler(err));
  }
}

function validate(newUser, callback) {
  createUserValidation(newUser, validated);
  
  function validated(err, fields) {
    callback(err, { validatedUser: fields });
  }
}

function createUser(validatedUser, callback) {
  store.create(validatedUser, created);

  function created(err, user) {
    callback(err, { user: user });
  }
}

function sendConfirmationEmail(user, callback) {
  mailer.deliverConfirmationEmail(user);
  callback();
}
