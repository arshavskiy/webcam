var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

const DIR = 'd:\\web\\stream\\public\\records';

function getFilesizeInBytes(filename) {
  const stats = fs.statSync(path.join(DIR, filename));
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

// let files = fs.readdirSync(DIR);
let files = fs.readdir(DIR, (err, files)=>{
  let fileDate = [];
  let bigfiles = [];
  files.forEach( file =>{
    const size = getFilesizeInBytes(file);
    const stats = fs.statSync(path.join(DIR, file));
    const date = (stats.mtime.getDay() < 10 ? '0' + stats.mtime.getDay(): stats.mtime.getDay()) + '.' + stats.mtime.getMonth() + '.' + stats.mtime.getFullYear();
    const mtime = date + ' ' + stats.mtime.getHours() + ':' + (stats.mtime.getMinutes() < 10 ? '0' + stats.mtime.getMinutes() : stats.mtime.getMinutes());
    if (size > 200484){
      fileDate.push(mtime);
      bigfiles.push(file);
    }
        // Do whatever you want to do with the file
  });

  router.get('/', function(req, res, next) {
    res.render('users', { title: 'Express', records: bigfiles.reverse(), date: fileDate.reverse() });
  });
  
});
// let date = files.forEach( file =>{
//   let fileDate = [];

//   const size = getFilesizeInBytes(file);
//   const stats = fs.statSync(path.join(DIR, file));
//   const mtime = stats.mtime.getHours() + ':' + stats.mtime.getMinutes();
//   if (size > 1024){
//     fileDate.push(mtime);
//   }
//       // Do whatever you want to do with the file
//   console.log('file size:' , size); 
//   return fileDate;
// });
   

/* GET users listing. */


module.exports = router;
