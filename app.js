const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const wav = require('wav');
const cors = require('cors');
const app = express();
const fs = require('fs');
const multer = require('multer'); //use multer to upload blob data
const upload = multer(); // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const chatRouter = require('./routes/chat');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cors());

let counter = 0;
// catch 404 and forward to error handler

const __DIR = path.join(__dirname, 'public');

app.use('/', express.static(__DIR));
app.use('/test', express.static(__DIR));
app.use('/admin', express.static(__DIR));

app.use('/', usersRouter);
app.use('/test', chatRouter);
app.use('/admin/', adminRouter);

app.post('/upload', upload.single('soundBlob'), function (req, res, next) {
  let uploadLocation = __DIR + '\\records\\' + req.file.originalname // where to save the file to. make sure the incoming name has a .wav extension
  fs.writeFile(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer)), function () { // write the blob to the server as a file
    console.log('wrote to file ' + req.file.originalname);
    res.sendStatus(200);
  });

});


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


// const WebSocket = require('ws');
// const ws = new WebSocket('ws://f19ba7e5.ngrok.io:8080');
// const wss = new WebSocket.Server({
//   port: 8080,
//   perMessageDeflate: {
//     zlibDeflateOptions: {
//       // See zlib defaults.
//       chunkSize: 1024,
//       memLevel: 7,
//       level: 3
//     },
//     zlibInflateOptions: {
//       chunkSize: 10 * 1024
//     },
//     // Other options settable:
//     clientNoContextTakeover: true, // Defaults to negotiated value.
//     serverNoContextTakeover: true, // Defaults to negotiated value.
//     serverMaxWindowBits: 10, // Defaults to negotiated value.
//     // Below options specified as default values.
//     concurrencyLimit: 10, // Limits zlib concurrency for perf.
//     threshold: 1024 // Size (in bytes) below which messages
//     // should not be compressed.
//   }
// });




// const BinaryServer = require('binaryjs').BinaryServer;

// const now = new Date(Date.now());
// const date = now.getDate() + '.' + now.getMonth() + '__' + Date.now();
// let outFile = 'public/records/' + date + '.wav';

// BinaryServer({
//   port: 9001
// }).on('connection', function (client) {
//   console.log('1. new connection');

//   let fileWriter = new wav.FileWriter(outFile, {
//     channels: 1,
//     sampleRate: 48000,
//     bitDepth: 16
//   });

//   client.on('stream', function (stream, meta) {
//     console.log('2. new stream');
//     stream.pipe(fileWriter);

//     stream.on('end', function () {
//       console.log('3 end stream');
//       fileWriter.end();

//       console.log('4 wrote to file ' + outFile);
//     });
//   });
// });


module.exports = app;