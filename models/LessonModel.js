const mongoose = require('mongoose');

const LessonModel = new mongoose.Schema(
    {
        start_date: { type: Date, default:Date.now},
        finish_date: {type: Date, required: false},
        assisted : { type: Array, default: []},
        not_assisted: { type: Array, default: []}
    }
);

module.exports = mongoose.model('lessons', LessonModel);