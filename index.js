const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001 || process.env.PORT;
const quotesRouter = require('./src/routes/hello');
const insertRouter = require('./src/routes/insert');
const updateRouter = require('./src/routes/update');

// create a new database file users.db or open existing users.db
const db = new sqlite3.Database('./sqlite/hello.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the hello.db database.');
});

// db.serialize let us run sqlite operations in serial order
db.serialize(() => {
    // 1rst operation (run create table statement)
    db.run('CREATE TABLE IF NOT EXISTS userCount(username text NOT NULL, provider text NOT NULL, count integer NOT NULL)', (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
});

app.get('/', (req, res) => {
  res.json({message: 'alive'});
});

app.use('/hello', quotesRouter);
app.use('/insert', insertRouter);
app.use('/update', updateRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Always close the connection with database
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});