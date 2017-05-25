const express = require('express');
const app = express();

const config = require('./config/config.js');
const glob = require('glob');

const mongoose = require('mongoose');
mongoose.connect(config.database);

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const routes = glob.sync('./routes/*.js');
routes.forEach(function onEach(file) {
  require(file)(app);
});

const errorHandler = require('./middleware/errorHandling');
app.use(errorHandler.logErrors);
app.use(errorHandler.handleMongoErrors);
app.use(errorHandler.finalErrorHandler);

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}!`)
});