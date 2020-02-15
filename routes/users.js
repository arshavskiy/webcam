var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

const files = fs.readdirSync('d:\\web\\stream\\public\\records', function (err, files) {
    let fileList = [];

    function getFilesizeInBytes(filename) {
      const stats = fs.statSync(filename);
      const fileSizeInBytes = stats.size;
      return fileSizeInBytes;
  }
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        const size = getFilesizeInBytes(file);
        if (size > 512){
          fileList.push(file);
        }
        // Do whatever you want to do with the file
        console.log('file size:' , size); 
    });
    return fileList;
  });

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('files: ', files);
  res.render('users', { title: 'Express', records: files.reverse() });
});

module.exports = router;
