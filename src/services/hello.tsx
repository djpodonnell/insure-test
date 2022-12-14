const dbObj = require('./db');

function getMultiple(user:string,provider:string) {
  return dbObj.query(`SELECT count FROM userCount WHERE username =? AND provider =?`, [user, provider]);
}

function insertRow(user:string,provider:string) {
  const sql = `INSERT INTO userCount (username,provider,count) VALUES (?,?,1)`;
  return dbObj.run(sql,[user,provider]);
}

function updateCount(user:string,provider:string,count:number) {
  const sql = `UPDATE userCount SET count = ? WHERE username =? AND provider = ?`;
  return dbObj.run(sql,[count,user,provider]);
}

module.exports = {
  getMultiple,
  insertRow,
  updateCount
}