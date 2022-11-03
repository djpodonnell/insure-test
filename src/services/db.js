const app = require('sqlite3');
const db = new app.Database('sqlite/hello.db');
const config = require('../config');

function query(sql, params) {
  return new Promise((resolve, reject) => {
    var count = 0;
    try {
      db.all(sql, params, (err, rows) => {
        if (err) {
          console.log("err = "+err.message);
        }
        rows.forEach((row) => {
          count = row.count;
        });
        resolve (count);
      });
    } catch (err) {
      reject(0);
    }
  })
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