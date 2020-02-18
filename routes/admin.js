var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

// Do whatever you want to do with the file

router.get('/', function (req, res, next) {

    const DIR = path.join(__dirname, "..", 'public/records');

    function getFilesizeInBytes(filename) {
        const stats = fs.statSync(path.join(DIR, filename));
        const fileSizeInBytes = stats.size;
        return fileSizeInBytes;
    }

    // let files = fs.readdirSync(DIR);
    let files = fs.readdirSync(DIR);
    let fileDate = [];
    let bigfiles = [];
    if (files.length) {
        files.forEach(file => {
            const size = getFilesizeInBytes(file);
            const stats = fs.statSync(path.join(DIR, file));
            const date = (stats.mtime.getDay() < 10 ? '0' + stats.mtime.getDay() : stats.mtime.getDay()) + '.' + stats.mtime.getMonth() + '.' + stats.mtime.getFullYear();
            const mtime = date + ' ' + stats.mtime.getHours() + ':' + (stats.mtime.getMinutes() < 10 ? '0' + stats.mtime.getMinutes() : stats.mtime.getMinutes());
            if (size > 200484) {
                fileDate.push(mtime);
                bigfiles.push(file);
            } else {
                fs.unlink(path.join(DIR, file), (err) => {
                    if (err) throw err;
                    console.log(path.join(DIR, file), ' was deleted');
                });
            }
        });
    }

    let messages = {};
    let messagesAll = [];
    let textedMsgs;

    const __DIR = path.join(__dirname, "..", 'public');
    fs.readdir(__DIR, (err, files) => {
        let fileDate = [];
        files = files.join(',');
        if (files.includes('messages')) {
            let data = fs.readFileSync(__DIR + '/messages.txt', 'utf8');
            textedMsgs = data.split('_EOL_');
        }

        res.render('admin', {
            title: 'Express',
            records: bigfiles.reverse(),
            date: fileDate.reverse(),
            mesages: textedMsgs
        });

    });


});

module.exports = router;