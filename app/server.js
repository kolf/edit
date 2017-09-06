/**
 * Created by tonglaiz on 2016/5/28.
 */
var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');

var app = express();
app.use(favicon(path.join(__dirname, '..', 'web', 'favicon.ico')));
