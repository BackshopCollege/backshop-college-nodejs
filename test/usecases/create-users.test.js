var assert = require('chai').assert;
var setup    = require('../setup');
var Fixtures = require('../fixtures');

describe('CreateUsers Usecase', function(){
  var core, validUser;

  before(function setupTest(done){
    setup(function(_core) {
      core = _core;
      done();
    });
  });

  it('register a valid user', function(done) {
    var userForm = Fixtures.User();
    core.users.create(userForm, function(err, user) {
      assert.notOk(err);
      assert.ok(user);
      validUser = user;
      done();
    });
  });

  it('does not save plain password', function(done){
    var userForm = Fixtures.User();
    core.users.create(userForm, function(err, user){
      assert.notOk(err);
      assert.ok(user);
      assert.notEqual(user.password, userForm.password);
      done();
    });
  });

  it('refutes without name', function(done) {
    var userForm = Fixtures.User();
    delete userForm.name;

    core.users.create(userForm, function(err, user){
      assert.ok(err);
      done();
    });
  });

  it('refutes non authorized field', function(done){
    var userForm = Fixtures.User({admin: true});
    core.users.create(userForm, function(err, user){
      assert.ok(err);
      done();
    });
  });

  it('refutes register username already taken', function(done){
    var userForm = Fixtures.User({ username: validUser.userName });
    core.users.create(userForm, function(err, user){
      assert.ok(err);
      done();
    });
  });

});
