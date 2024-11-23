var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var bookRouter = require('./routes/book');
var authRoute = require('./routes/auth');
var categoryRoute = require('./routes/category');
var authorRoute = require('./routes/author')
var dashboardRoute = require('./routes/dashboard')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin/books', bookRouter);
app.use('/admin/categories', categoryRoute);
app.use('/auth', authRoute);
app.use('/admin/authors', authorRoute)
app.use("/admin/dashboard", dashboardRoute)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.error(err.stack)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  res.status(500).json({
    error: err.stack
  });
});

module.exports = app;

// Khởi động server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Server is running on http://localhost:' + port);
});

