const express = require('express');
const app = express();
const BodyParser = require('body-parser');
// const Constant = require('./config/constant');
const User = require('./routes/user');
const Blogs = require('./routes/blogs');

const DB = require('./config/db');

const PORT = process.env.PORT || 3000;

// app.use('/', (req, res) => {

//     res.send("Hello i am working");
// })
app.use('/', (req, res, next) => {
    res.send("<h1>You are connected</h1");
})

app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.use(User);
app.use(Blogs);

app.use('*', (req, res) => {

    res.send("404");
})

DB(function () {
    app.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`);
    })

})
