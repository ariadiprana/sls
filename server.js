// server.js

// set up ======================================================================
// get all the tools we need
process.env.TZ = 'Asia/Jakarta'
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fileUpload = require('express-fileupload');

var connection = require('express-myconnection');
var mysql = require('mysql');

var app      = express();
var port     = process.env.PORT || 8080;

var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');
var dbconfig = require('./config/database');

// configuration ===============================================================
// filup load support
app.use(fileUpload());
require('dotenv').config()

// connect to our database
app.use(
  connection(mysql,{
      host: dbconfig.connection.host,
      user: dbconfig.connection.user,
      password : dbconfig.connection.password,
      port : dbconfig.connection.port,
      database:dbconfig.database,
      multipleStatements: true
  },'pool') //or single
)


require('./config/passport')(passport); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
