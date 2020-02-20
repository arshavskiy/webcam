const express = require('express');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, "..", 'public/records');

function utils() { 

}

utils.setFileName = file =>{
        let string = file.mtime.toDateString();
        let day = file.mtime.getDate();
        let month = file.mtime.getMonth() + 1;
        day = day < 10 ? '0' + day  : day;
        month = month < 10 ? '0' + month: month;
        let date = day + '.' + month  + '.' + file.mtime.getFullYear();
        return date + ' ' + file.mtime.getHours() + ':' + (file.mtime.getMinutes() < 10 ? '0' + file.mtime.getMinutes() : file.mtime.getMinutes());
};

utils.getFilesizeInBytes = filename =>{
    const DIR = path.join(__dirname, "..", 'public/records');
    const stats = fs.statSync(path.join(DIR, filename));
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes;
};

utils.initAdmin = () => {

    return new Promise((resolve, reject) => {
        let fileDate = [];
        let bigfiles = [];
        let textedMsgs;
        let files = fs.readdirSync(DIR);

        if (files.length) {
            files.forEach(file => {
                // const size = utils.getFilesizeInBytes(file);
                const stats = fs.statSync(path.join(DIR, file));
                const mtime = utils.setFileName(stats);
                // if (size > 200484) {
                    fileDate.push(mtime);
                    bigfiles.push(file);
                // }

                const __DIR = path.join(__dirname, "..", 'public');
                fs.readdir(__DIR, (err, files) => {
                    files = files.join(',');
                    if (files.includes('messages')) {
                        let data = fs.readFileSync(__DIR + '/messages.txt', 'utf8');
                        textedMsgs = data.split('_EOL_');
                    }

                    const payload = {
                        fileDate,
                        bigfiles,
                        textedMsgs
                    };

                    resolve(payload);
                });

            });
        }
    });
};

utils.initUsers = () => {

    return new Promise((resolve, reject) => {

            const DIR = path.join(__dirname, "..", 'public/records');
            let files = fs.readdir(DIR, (err, files) => {
                let fileDate = [];
                let bigfiles = [];
                files.forEach(file => {
                    // const size = utils.getFilesizeInBytes(file);
                    const stats = fs.statSync(path.join(DIR, file));
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
    initAdmin : utils.initAdmin,
    initUsers : utils.initUsers,
};