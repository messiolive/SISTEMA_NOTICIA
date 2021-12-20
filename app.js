const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongDBSession = require('connect-mongodb-session')(session);

const indexRouter = require('./routes/index.router');
const usersRouter = require('./routes/users.router');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'default',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views/layouts'),
  helpers: {
    ifeq: (a, b) => {
      return a == b;
    }
  }
}));
app.set('view engine', 'hbs');

const mongoUrl = 'mongodb://localhost:27017/users';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const sessionStore = new MongDBSession({
  uri: mongoUrl,
  collection: 'sessions'
});

app.use(session({
  secret: 'ntmzJariXFVefmDu55iGFlIlmy9WP44l',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
