const app = require('sqlite3');
const db = new app.Database('sqlite/hello.db');

function query(sql:string, params:object[]) {
  return new Promise((resolve, reject) => {
    var count = 0;
    try {
      db.all(sql, params, (err:any, rows:object[]) => {
        if (err) {
          console.log("err = "+err.message);
        }
        rows.forEach((row:any) => {
          count = row.count;
        });
        resolve (count);
      });
    } catch (err) {
      reject(0);
    }
  })
}

async function run(sql:string,params:object[]) {
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