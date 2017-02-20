var express = require('express');
var app = express();
var port = process.env.PORT || 5001;


var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var path = require('path');
global.appRoot = path.resolve(__dirname);

require('./app/routes/main.js')(app);

app.use(morgan('dev')); // logger
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('html', require('consolidate').mustache);
app.set('views', __dirname + '/public');
app.set('view engine', 'html');




app.use(express.static('public'));

app.listen(port);
console.log('Application running on port:' + port);
