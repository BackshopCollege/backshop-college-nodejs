
var fs      = require('fs');
var path    = require('path');
var assert  = require('assert');
var mongoose = require('mongoose');
var xtend   = require('util')._extend;

module.exports = Core;

function Core(opts) {

  loadModels();
  var database    = startMongoose(opts);
  var usecases    = loadUsecases();
 
  var internals = {
    _store: database
  };

  var interface = xtend(internals, usecases);
  return interface;
}

function loadUsecases() {
  var usecasesDir = path.join(__dirname, "/lib/usecases");
  return fs.readdirSync(usecasesDir).reduce(function(acc, dir) {
    var usecase =  require(path.join(usecasesDir, dir));
    acc[dir]    =  usecase;
    return acc;
  }, { });
}

function startMongoose(opts, cb) {
  assert(opts.databaseOpts, 'need databaseOpts to initialize');
 
  var uri = opts.databaseOpts.uri;
  var options = opts.databaseOpts.options;
  
  mongoose.connect(uri, options, function(err) { 
    if(err) throw err; 
  });
  
  return mongoose;
}

function loadModels() {  
  var modelsDir = path.join(__dirname, "/lib/models");
  fs.readdirSync(modelsDir).forEach(function(model) {
    if(model.match(/\.js$/)) require(path.join(modelsDir, model));
  });
}
