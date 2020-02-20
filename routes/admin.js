const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const {
    initAdmin
} = require('../server/middleware');

function handleFn(req, res, next) {

    initAdmin().then(payload => {

        res.render('admin', {
            title: 'Express',
            records: payload.bigfiles.reverse(),
            date: payload.fileDate.reverse(),
            mesages: payload.textedMsgs
        });

    });
}

router.get('/', handleFn);


module.exports = router;