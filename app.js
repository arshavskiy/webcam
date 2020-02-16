const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const wav = require('wav');
const app = express();
const fs = require('fs');

const indexRouter = require('./routes/index');
const chatRouter = require('./routes/chat');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
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
app.use('/users', express.static(path.join(__dirname, 'public')));

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


const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');
const wss = new WebSocket.Server({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

const messages = {};
const messagesAll = [];
const DIR = path.join(__dirname, 'public');

wss.on('connection', function connection(ws, req) {
  const ip = req.connection.remoteAddress;


  let data = fs.readFileSync(DIR + '/messages.txt', 'utf8');
  textedMsgs = data.split('_EOL_');
  console.log(textedMsgs);

  wss.clients.forEach(function each(client) {
    if (client == ws && client.readyState === WebSocket.OPEN) {
      client.send(wss.clients.size - 1, 'connection opened');
      if (textedMsgs.length>0){
          textedMsgs.forEach( msg=>{
            client.send(msg);
          });
      }
      // if (messagesAll.length > 0){
      //   messagesAll.forEach( msg=>{
      //     client.send(msg);
      //   });
      // }
     
      console.log(wss.clients.size - 1 , ' connection opened' );
    }
  });

  ws.on('message', function incoming(message) {

    if ( Object.keys(messages)!= ip){
      messages[ip] = [];
    }
    messages[ip].push(message);
    // messagesAll.push(ip + ' : ' + message);
   
    fs.appendFile(DIR + '/messages.txt', ip + ' : ' + message + '_EOL_ \r\n', function (err) {
      if (err) throw err;
      console.log('Saved!');
    });


    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
       
        console.log('received: %s', messages[ip]);
        client.send(ip + ' : ' + message);
      }

    });
  });

  ws.on('open', function open() {
    ws.send('open something');
  });


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

BinaryServer({
  port: 9001
}).on('connection', function (client) {
  console.log('1. new connection');

  let fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });

  client.on('stream', function (stream, meta) {
    console.log('2. new stream');
    stream.pipe(fileWriter);

    stream.on('end', function () {
      console.log('3 end stream');
      fileWriter.end();

      console.log('4 wrote to file ' + outFile);
    });
  });
});


module.exports = app;