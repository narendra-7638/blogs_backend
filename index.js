const express = require('express');
const app = express();
const server = require('http').createServer(app);
const BodyParser = require('body-parser');
// const Constant = require('./config/constant');
const User = require('./routes/user');
const Blogs = require('./routes/blogs');

const DB = require('./config/db');

const PORT = process.env.PORT || 3000;

// socket
const io = require('socket.io')(server);

var i = 0;

io.on('connection', socket => {
    socket.emit('connected', "You are connected");
})

setInterval(function(){
    // console.log('pumping...');
    io.emit('pump', i++);
}, 5000);

app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.use(User);
app.use(Blogs);

app.use('/', (req, res, next) => {
    res.send("<h1>You are connected</h1");
})

app.use('*', (req, res) => {

    res.send("404");
})

DB(function () {
    server.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`);
    })

})
