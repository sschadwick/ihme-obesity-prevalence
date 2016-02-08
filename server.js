'use strict';

var express = require('express');
var app = express();

app.use(express.static('public'));

app.use(function(req, res) {
  res.status(404).send('Page not found');
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('server is running on ' + port);
});
