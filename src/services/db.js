const app = require('sqlite3');
const db = new app.Database('sqlite/hello.db');
const config = require('../config');

async function query(sql, params) {
  const row = await db.get(sql, params);

  return row;
}

async function run(sql,params) {
    try {
      await db.run(sql,params);
      return "message : ok";
    } catch (err) {
      return "message : fail";
    }
  }

module.exports = {
  query,
  run
}