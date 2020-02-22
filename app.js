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
const utils = require('./server/utils');
const middleware = require('./server/middleware');

// const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const chatRouter = require('./routes/chat');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

let devcounter = 0;

app.use(logger('dev'));
app.use( function (req, res, next){

  //use only per state
  if (!req.originalUrl.includes('.')){
    console.debug('originalUrl: ', req.originalUrl, devcounter++);
    utils.cleanSmallFile();
    middleware.initMessages();
  }

  next();
});

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

app.use('/', adminRouter); //usersRouter
app.use('/test', chatRouter);
app.use('/admin/', adminRouter);

app.post('/upload', upload.single('soundBlob'), function (req, res, next) {
  let uploadLocation = __DIR + '\\records\\' + req.file.originalname; // where to save the file to. make sure the incoming name has a .wav extension
  fs.writeFile(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer)), function () { // write the blob to the server as a file
    console.log('wrote to file ' + req.file.originalname);
    res.sendStatus(200);
  });

});

app.post('/message', function (req, res, next) {
  const message = req.body.message;
  DIR = path.join(__dirname, 'public' , '/messages.txt');
  if (message && message.length > 1){
    fs.appendFile(DIR , ':' + message + '_EOL_ \r\n', function (err) {
      if (err) {
        throw err;
      } else {
        console.log( message, 'message Saved!');
        res.send({ 'message': message });
      }
     
    });
  }

  

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



module.exports = app;