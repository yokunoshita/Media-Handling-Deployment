require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));
app.use(express.json());

const router = require('./routes/index');
app.use('/api/img', router);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: false,
        message: err.message,
        data: null
    });
});

app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: `Are you lost? ${req.method} ${req.url} is not registered!`,
        data: null
    });
});

module.exports = app;
