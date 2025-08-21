const express = require('express');

const router = express.Router();

router.use('/', (_req, res, next) => {
    fetch('https://www.marijuanamoment.net/feed/')
        .then(response => response.text())
        .then(xmlText => {
            res.setHeader('Content-Type', 'application/xml');
            res.contentType('xml');
            res.send(xmlText);
        })
        .catch(next);
});

module.exports = router;
