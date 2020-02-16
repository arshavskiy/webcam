var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');


function handle(req, res, next) {
  const DIR = path.join(__dirname, "..", 'public/records');
  function getFilesizeInBytes(filename) {
    const stats = fs.statSync(path.join(DIR, filename));
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes;
  }
  let files = fs.readdir(DIR, (err, files) => {
    let fileDate = [];
    let bigfiles = [];
    files.forEach(file => {
      const size = getFilesizeInBytes(file);
      const stats = fs.statSync(path.join(DIR, file));
      const date = (stats.mtime.getDay() < 10 ? '0' + stats.mtime.getDay() : stats.mtime.getDay()) + '.' + stats.mtime.getMonth() + '.' + stats.mtime.getFullYear();
      const mtime = date + ' ' + stats.mtime.getHours() + ':' + (stats.mtime.getMinutes() < 10 ? '0' + stats.mtime.getMinutes() : stats.mtime.getMinutes());
      if (size > 200484) {
        fileDate.push(mtime);
        bigfiles.push(file);
      }
      // Do whatever you want to do with the file
    });
  });
}

router.get('/', handle);

module.exports = router;
