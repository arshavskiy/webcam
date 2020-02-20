const express = require('express');
const path = require('path');
const fs = require('fs');

const __RECORDS = path.join(__dirname, "..", 'public/records');
const __PUBLIC = path.join(__dirname, "..", 'public');

function utils() { 

}

utils.cleanSmallFile = () => {
    let files = fs.readdirSync(__RECORDS);
    if (files && files.length) {
        files.forEach(file => {
            const size = utils.getFilesizeInBytes(file);
            if (size < 200484) {
                fs.unlink(path.join(__RECORDS, file), (err) => {
                    if (err) reject(err);
                    console.log(path.join(__RECORDS, file), 'too small file was deleted');
                });
            }
          });
        }
    };
  

utils.setFileName = file =>{
    let day = file.mtime.getDate();
    let month = file.mtime.getMonth() + 1;
    day = day < 10 ? '0' + day  : day;
    month = month < 10 ? '0' + month: month;
    let date = day + '.' + month  + '.' + file.mtime.getFullYear();
    return date + ' ' + file.mtime.getHours() + ':' + (file.mtime.getMinutes() < 10 ? '0' + file.mtime.getMinutes() : file.mtime.getMinutes());
};

utils.getFilesizeInBytes = filename => {
    const stats = fs.statSync(path.join(__RECORDS, filename));
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes;
};

utils.payload = ()=>{
    return new Promise((resolve, reject) => {
        fs.readdir(__RECORDS, (err, files) => {
            let fileDate = [];
            let bigfiles = [];
            files.forEach(file => {
                // const size = utils.getFilesizeInBytes(file);
                const stats = fs.statSync(path.join(__RECORDS, file));
                const mtime = utils.setFileName(stats);
                // if (size > 200484) {
                    fileDate.push(mtime);
                    bigfiles.push(file);
                // }
            });
    
            const payload = {
                fileDate,
                bigfiles
            };

            resolve(payload);
        });
    });
   
};

module.exports = {
    setFileName : utils.setFileName,
    getFilesizeInBytes : utils.getFilesizeInBytes,
    payload: utils.payload,
    cleanSmallFile : utils.cleanSmallFile,

};