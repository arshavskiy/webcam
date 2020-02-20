var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

const { initUsers } = require('../server/utils');

function handleFn(req, res, next) {

  initUsers().then( payload => {

    res.render('users', {
      title: 'Express',
      records: payload.bigfiles.reverse(),
      date: payload.fileDate.reverse()
    });

  });

}

router.get('/', handleFn);

module.exports = router;