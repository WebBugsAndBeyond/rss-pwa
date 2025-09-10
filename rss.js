const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        const feedUrl = decodeURIComponent(req.query.feed); 
        fetch(feedUrl)
            .then(response => response.text())
            .then(xmlText => {
                res.setHeader('Content-Type', 'application/xml');
                res.contentType('xml');
                res.send(xmlText);
            })
            .catch(next);
    } catch (error) {
        next(error);
    }
});


module.exports = router;
