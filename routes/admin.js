var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

const files = fs.readdirSync('d:\\web\\stream\\public\\records', function (err, files) {
    let fileList = [];
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        fileList.push(file);
        // Do whatever you want to do with the file
        console.log(file); 
    });
    return fileList;
  });

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('files: ', files);
  res.render('admin', { title: 'Express' , records: files});
});

module.exports = router;
