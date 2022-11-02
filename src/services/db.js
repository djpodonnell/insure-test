const app = require('sqlite3');
const db = new app.Database('sqlite/hello.db');
const config = require('../config');

async function query(sql, params) {
  var count = 0;
  console.log("sql = "+sql+",par = "+params+" at "+Date.now());
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.log("err = "+err.message);
    }
    rows.forEach((row) => {
      console.log("key = "+Object.keys(row));
      console.log("val = "+Object.values(row));
      count = row.count;
    });
    console.log("ret = "+count+" at "+Date.now());
    return count;
  });
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