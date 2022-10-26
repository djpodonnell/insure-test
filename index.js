const express = require('express');
const app = express();
const port = 3001 || process.env.PORT;
const quotesRouter = require('./src/routes/hello');
const insertRouter = require('./src/routes/insert');
const updateRouter = require('./src/routes/update');

app.get('/', (req, res) => {
  res.json({message: 'alive'});
});

app.use('/hello', quotesRouter);
app.use('/insert', insertRouter);
app.use('/update', updateRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});