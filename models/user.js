const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    name: { type: String, default: "User" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_on: { type: Date, required: true }
})


module.exports = mongoose.model('user', user);