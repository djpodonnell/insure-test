const app = require('sqlite3');
const db = new app.Database('sqlite/hello.db');
const config = require('../config');

async function query(sql, params) {
  //var stmt = db.prepare(sql);
  const row = await db.get(sql, params);

  return row;
}

async function run(sql,params) {
    await db.run(sql,params);
  }

module.exports = {
  query,
  run
}