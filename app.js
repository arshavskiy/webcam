
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const wav = require('wav');
const app = express();

const indexRouter = require('./routes/index');
const chatRouter = require('./routes/chat');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

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


// let http = require('http').Server(app);
// let io = require('socket.io')(http);

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });


const now = new Date(Date.now());
// const date = now.getDate() + '_' + now.getMonth() + '__' + now.getHours() + '.' + now.getMinutes();
const date = now.getDate() + '.' + now.getMonth() + '__' + Date.now();

let outFile = 'public/records/' + date + '.wav';
// let outFile = 'public/demo.wav';

const BinaryServer = require('binaryjs').BinaryServer;

BinaryServer({port: 9001}).on('connection', function(client) {
  console.log('1. new connection');
 
  let fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });

  client.on('stream', function(stream, meta) {
    console.log('2. new stream');
    stream.pipe(fileWriter);

    stream.on('end', function() {
      console.log('3 end stream');
      fileWriter.end();

      console.log('4 wrote to file ' + outFile);
    });
  });
});


module.exports = app;

