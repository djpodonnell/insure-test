const app = require('sqlite3');
const dbReq = new app.Database('sqlite/hello.db');

function query(sql:string, params:object[]) {
  return new Promise((resolve, reject) => {
    var count = 0;
    try {
      dbReq.all(sql, params, (err:object, rows:object[]) => {
        if (err) {
        }
        rows.forEach((row:any) => {
          count = row.count;
        });
        resolve (count);
      });
    } catch (err) {
      reject(err);
    }
  })
}

async function run(sql:string,params:object[]) {
    try {
      await dbReq.run(sql,params);

      return "message : ok";
    } catch (err) {
      return "message : fail";
    }
  }

module.exports = {
  query,
  run
}