const db = require('./db');
const config = require('../config');

function getMultiple(page = 1,user,provider) {
  const offset = (page - 1) * config.listPerPage;
  //const sql = `DELETE FROM userCount`;
  //db.run(sql,[]);
  const data = db.query(`SELECT count FROM userCount WHERE username =? AND provider =? LIMIT ?,? `, 
  [user, provider, offset, config.listPerPage]);
  const meta = {page};

  return {
    data,
    meta
  }
}

function insertRow(user,provider) {
  const sql = `INSERT INTO userCount (username,provider,count) VALUES (?,?,0)`;
  db.run(sql,[user,provider]);
}

function updateCount(user,provider,count) {
  const sql = `UPDATE userCount SET count = ? WHERE username =? AND provider = ?`
  db.run(sql,[count,user,provider]);
}

module.exports = {
  getMultiple,
  insertRow,
  updateCount
}