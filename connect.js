const knex = require('knex');

function connect() {
  let connection = knex({
    client: 'mysql',
    connection: {
      host : 'songq-remote.cjizmy9yahnl.us-east-2.rds.amazonaws.com',
      user : 'gautam',
      password : 'damansara75',
      database : 'SongQ'
    }
  });

  return connection;
}

module.exports = connect;
