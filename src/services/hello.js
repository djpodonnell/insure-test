const db = require('./db');

function getMultiple(user,provider) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT count FROM userCount WHERE username =? AND provider =?`, [user, provider])
    .then(count => {
        resolve(count);
    });
  });
}

function insertRow(user,provider) {
  const sql = `INSERT INTO userCount (username,provider,count) VALUES (?,?,1)`;
  return db.run(sql,[user,provider]);
}

function updateCount(user,provider,count) {
  const sql = `UPDATE userCount SET count = ? WHERE username =? AND provider = ?`;
  return db.run(sql,[count,user,provider]);
}

module.exports = {
  getMultiple,
  insertRow,
  updateCount
}