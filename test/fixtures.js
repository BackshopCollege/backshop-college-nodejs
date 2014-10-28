var faker = require('faker');
var xtend = require('util')._extend;

module.exports = {
  User: userFixture
};

function userFixture(override) {

  var user = {
    name: faker.name.firstName(),
    username: faker.internet.userName(),
    password: faker.lorem.words(5).join('')
  };

  return xtend(user, override);
}
