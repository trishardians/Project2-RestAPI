var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

var indexRouter = require('./routes/index');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

const db = require("./models");
db.sequelize.sync()
    .then(() => {
        console.log("sync db");
    })
    .catch((err) => {
        console.log("error: " + err.message);
    })

app.use('/', indexRouter);


module.exports = app;
