const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogs = new Schema({
    title: { type: String },
    body: { type: String },
    created_on: { type: Date },
    updated_on: { type: Date },
    created_by: { type: mongoose.SchemaTypes.ObjectId, ref: 'user' },
    updated_by: { type: mongoose.SchemaTypes.ObjectId, ref: 'user' },
    deleted_by: { type: mongoose.SchemaTypes.ObjectId, ref: 'user' },
    is_deleted: { type: Boolean, default: false }
})


module.exports = mongoose.model('blogs', blogs);