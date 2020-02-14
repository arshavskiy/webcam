
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var wav = require('wav');
var fs = require('fs');
var wav = require('wav');
var app = express();

var indexRouter = require('./routes/index');
var chatRouter = require('./routes/chat');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', usersRouter);
app.use('/users', usersRouter);
app.use('/chat/', chatRouter);
app.use('/admin/', adminRouter);

app.post('/save', function (req, res) {
  res.send('POST request to the homepage');
});

let counter = 0;

// catch 404 and forward to error handler





app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.use('/chat', express.static(path.join(__dirname, 'public')));
app.use('/users',  express.static(path.join(__dirname, 'public')));

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


// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });


const now = new Date(Date.now());
const date = now.getDate() + '-' + now.getMonth() + '__' + now.getHours() + '.' + now.getMinutes();

var outFile = 'public/records/' + date + '_record.wav';
// var outFile = 'public/demo.wav';

const BinaryServer = require('binaryjs').BinaryServer;

BinaryServer({port: 9001}).on('connection', function(client) {
  console.log('new connection');
 
  var fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });

  client.on('stream', function(stream, meta) {
    console.log('new stream');
    stream.pipe(fileWriter);

    stream.on('end', function() {
      console.log('end stream');
      fileWriter.end();

      console.log('wrote to file ' + outFile);
    });
  });
});


module.exports = app;

