const mongoose = require('mongoose');

let url = "mongodb+srv://learner:1234@learner-ji6bt.mongodb.net/blogger?retryWrites=true"
let obj = {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true
}

module.exports = (cb) => {
    mongoose.connect(url, obj)
        .then(data => {
            console.log("Successfully connected to DB");
            cb();
        })
        .catch(error => {
            console.log(`Error Connecting DB: ${JSON.stringify(error)}`);
        })
}