const bookshelf = require('./../bookshelf');

module.exports = bookshelf.Model.extend({
  tableName: 'requests',
  idAttribute: 'id'
});
