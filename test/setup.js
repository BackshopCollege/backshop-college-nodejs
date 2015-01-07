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
  var todo = Object.keys(collections).length;

  if (!todo) return cb();

  for (var i in collections) {
    if (collections[i].name.match(/^system\./)) return --todo;
    collections[i].remove({}, { safe: true }, count);
  }

  function count (err) {
    if (err)
      return console.trace(err);

    if (--todo === 0)
      cb();
  }
}

