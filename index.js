require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();
const apiRouter = require('./api');
server.use('/api', apiRouter);
const morgan = require('morgan');
server.use(morgan('dev'));
server.use(express.json());
const { client } = require('./db');

server.use((req, res, next) => {
    console.log("<___body logger start___>");
    console.log(req.body);
    console.log("<____body logger end____>");

    next();
});


client.connect();
server.listen(PORT, () => {
    console.log('the server is up on port', PORT)
})
