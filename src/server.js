'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandlerAuth = require('./auth-server/error-handlers/500.js');
const notFoundAuth = require('./auth-server/error-handlers/404.js');
const notFoundHandlerApi = require('./api-server/error-handlers/404.js');
const errorHandlerApi = require('./api-server/error-handlers/500.js');
const logger = require('./api-server/middleware/logger.js');
const authRoutes = require('./auth-server/auth/router.js');

const v1Routes = require('./api-server/routes/v1.js');
const v2Routes = require('./api-server/routes/v2.js');


// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

// Routes
app.use(authRoutes);


app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
app.use(express.static('src/public'));


app.get('/', (req,res) =>{
  res.sendFile('./public/index.html');
});

// Catchalls //
app.use(notFoundAuth);
app.use(errorHandlerAuth);
app.use('*', notFoundHandlerApi);
app.use(errorHandlerApi);


module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};