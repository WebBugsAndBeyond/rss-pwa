const path = require('path');
const express = require('express');
const rss = require('./rss');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
    if (req.accepts('xml')) {
        res.status(500);
        res.contentType('application/xml');
        res.send(`<?xml version="1.0" charset="UTF-8"?>
            <error>
                <message>${err.message}</message>
            </error>
        `);
    } else {
        res.status(500);
        res.send(err.message);
    }
});

app.get('/', (req, res) => {
    // const indexPath = path.join(__dirname, 'index.html');
    // res.sendFile(indexPath);
    res.redirect(308, '/index.html');
});

app.use('/feed', rss);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
