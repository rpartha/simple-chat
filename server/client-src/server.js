const express = require('express');
const app = express();
const path = require('path');
const port = 8080;

console.log(`Client server started at http://localhost:${port}/ ...`);

app.get('/', function(req, res) {
    console.log('New client request');
    res.sendFile(path.join(__dirname + '/client.html'));
});

app.listen(port);