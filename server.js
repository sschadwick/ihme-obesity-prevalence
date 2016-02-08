'use strict';

var express = require('express');
var app = express();
var unzip = require('unzip');
var fs = require('fs');
var fstream = require('fstream');
var url = require('url');

var readStream = fs.createReadStream('public/IHME_GBD_2013_OBESITY_PREVALENCE_1990_2013_Y2014M10D08.zip');
var writeStream = fstream.Writer('public/');

readStream
  .pipe(unzip.Parse())
  .pipe(writeStream);

app.use(express.static('public'));

app.use(function(req, res) {
  res.status(404).send('Page not found');
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('server is running on ' + port);
});
