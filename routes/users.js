var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('res: ', res);
  res.render('users', { title: 'Express' });
});

module.exports = router;
