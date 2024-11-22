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
app.use('/admin/author', authorRoute)
app.use("/admin/dashboard", dashboardRoute)


// app.get('/detail-book', (req, res) => {
//   res.render('detail_book');
// });
// app.get('/book-list', (req, res) => {
//   res.render('book_list');
// });
// app.get('/author-list', (req, res) => {
//   res.render('author_list');
// });
// app.get('/login', (req, res) => {
//   res.render('login');
// });
// app.get('/admin', (req, res) => {
//   res.render('admin/index_admin');
// });

// app.get('/admin/manage-book', (req, res) => {
//   res.render('admin/manage_book');
// });
// app.get('/admin/add-book', (req, res) => {
//   res.render('admin/add_book');
// });
// app.get('/admin/edit-book', (req, res) => {
//   res.render('admin/edit_book');
// });

// app.get('/admin/manage-category', (req, res) => {
//   res.render('admin/manage_category');
// });
// app.get('/admin/manage-author', (req, res) => {
//   res.render('admin/manage_author');
// });



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// Khởi động server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Server is running on http://localhost:' + port);
});

