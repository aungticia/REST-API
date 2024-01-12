'use strict'; // load modules

var express = require('express');

var morgan = require('morgan');

var Sequelize = require('sequelize');

var _require = require('./config/config.json'),
    development = _require.development;

var asyncHandler = require('./middleware/asyncHandler'); // variable to enable global error logging


var enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true'; // router import

var routes = require('./routes'); // create the Express app


var app = express(); //add a body property to the express request

app.use(express.json()); // setup morgan which gives us http request logging

app.use(morgan('dev')); //connection to database

var sequelize = new Sequelize(development); // test if connection is established

sequelize.authenticate().then(function () {
  return console.log('connection established');
})["catch"](function (err) {
  return console.log("Error connecting to database:", err.message);
}); // use api routes

app.use('/api/', routes); // setup a friendly greeting for the root route

app.get('/', function (req, res) {
  res.json({
    message: 'Welcome to the REST API project!'
  });
}); // send 404 if no other route matched

app.use(function (req, res) {
  res.status(404).json({
    message: 'Route Not Found'
  });
}); // setup a global error handler

app.use(function (err, req, res, next) {
  if (enableGlobalErrorLogging) {
    console.error("Global error handler: ".concat(JSON.stringify(err.stack)));
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
}); // set our port

app.set('port', process.env.PORT || 3000); // start listening on our port

var server = app.listen(app.get('port'), function () {
  console.log("Express server is listening on port ".concat(server.address().port));
});