
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })
const users = {}


const sendTo = (ws, message) => {
  ws.send(JSON.stringify(message))
}

wss.on('connection', ws => {
  console.log('User connected')

  ws.on('message', message => {
    let data = null

    try {
      data = JSON.parse(message)
    } catch (error) {
      console.error('Invalid JSON', error)
      data = {}
    }

    switch (data.type) {
      case 'login':
        console.log('User logged', data.username)
        if (users[data.username]) {
          sendTo(ws, { type: 'login', success: false })
        } else {
          users[data.username] = ws
          ws.username = data.username
          sendTo(ws, { type: 'login', success: true })
        }
        break
      case 'offer':
        console.log('Sending offer to: ', data.otherUsername)
        if (users[data.otherUsername] != null) {
          ws.otherUsername = data.otherUsername
          sendTo(users[data.otherUsername], {
            type: 'offer',
            offer: data.offer,
            username: ws.username
          });
        }
        break
      case 'answer':
        console.log('Sending answer to: ', data.otherUsername)
        if (users[data.otherUsername] != null) {
          ws.otherUsername = data.otherUsername
          sendTo(users[data.otherUsername], {
            type: 'answer',
            answer: data.answer,
            users: users
          })
        }
        break
      case 'candidate':
        console.log('Sending candidate to:', data.otherUsername)
        if (users[data.otherUsername] != null) {
          sendTo(users[data.otherUsername], {
            type: 'candidate',
            candidate: data.candidate
          })
        }
        break
      case 'close':
        console.log('Disconnecting from', data.otherUsername)
        users[data.otherUsername].otherUsername = null

        if (users[data.otherUsername] != null) {
          sendTo(users[data.otherUsername], { type: 'close' })
        }

        break

      default:
        sendTo(ws, {
          type: 'error',
          message: 'Command not found: ' + data.type
        })

        break
    }
  })

  ws.on('close', () => {
    if (ws.username) {
      delete users[ws.username]

      if (ws.otherUsername) {
        console.log('Disconnecting from ', ws.otherUsername)
        users[ws.otherUsername].otherUsername = null

        if (users[ws.otherUsername] != null) {
          sendTo(users[ws.otherUsername], { type: 'close' })
        }
      }
    }
  })
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

