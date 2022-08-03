const PORT = 3000;
const express = require('express');
const server = express();



server.use((req, res, next) => {
    console.log("<___body logger start___>");
    console.log(req.body);
    console.log("<____body logger end____>");

    next();
});

server.listen(PORT, () => {
    console.log('the server is up on port', PORT)
});