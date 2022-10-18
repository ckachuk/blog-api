var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var helmet = require('helmet');
var mongoose = require('mongoose');
require('dotenv').config()
require('./passport');

var indexRouter = require('./routes/index');


var app = express();

//db connection
mongoose.connect(process.env.DB_PATH, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet())
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);


app.listen(5000 , function () {
  console.log(' app listening on port 5000 !');
});


module.exports = app;
