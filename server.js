var http = require('http');
var path = require('path');

var express = require('express');

var configuration = require('./lib/configuration');
var routes = require('./lib/routes');
var middlewares = require('./lib/middlewares');
var logger = require('./lib/logger');

var app = express();

app.use(express.bodyParser());

middlewares.install(app);
routes.install(app);

app.all('*', function(req, res, next) {
    var e = new Error('Not found: ' + req.method + '_' + req.path);
    e.statusCode = 404;
    handleError(e, req, res, next);
});

app.use(handleError);

app.listen(configuration.port);

logger.info('miataru server is listening to: %d', configuration.port);

function handleError(error, req, res, next) {
    logger.error('error handler received error: ' + error.message);
    res.send(error.statusCode || 500, {error: error.message});
}