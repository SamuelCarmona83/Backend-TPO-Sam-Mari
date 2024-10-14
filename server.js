const express = require('express');

const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    res.send('welcome to my server');
})

app.listen(PORT, () => {
    console.log('server running on port: ', PORT);
})