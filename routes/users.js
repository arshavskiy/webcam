const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const {
    initUsers
} = require('../server/middleware');

function handleFn(req, res, next) {

    initUsers().then(payload => {

        res.render('users', {
            title: 'Express',
            records: payload.bigfiles.reverse(),
            date: payload.fileDate.reverse()
        });

    });

}

router.get('/', handleFn);

module.exports = router;