var Core = require('../');
var config = require('./config');
var async = require('async');
var mongoose = require('mongoose');

module.exports = setup;
function setup(cb) {
  var core = Core(config);
  cleanUp(core._database, function(err){
    cb(core);
  });
}

function cleanUp(database, cb){
  var collections = mongoose.connection.collections;
   var todo = collections.length;
  if (!todo) return cb();
  
  collections.forEach(function(collection) {
    if (collection.collectionName.match(/^system\./)) return --todo;

      collection.remove({ },{ safe: true }, function() {
      if (--todo === 0) cb();
    });
  });
}

