const mongoose = require('mongoose');
const moment = require('moment');

const LessonModel = new mongoose.Schema(
    {
        title: {type: String, required: true},
        code: {type:Number, required:true},
        start_date: { type: Date, default:Date.now},
        finish_date: {type: Date, required: false, default:undefined},
        assisted : { type: Array, default: []},
        not_assisted: { type: Array, default: []}
    }
);

module.exports = mongoose.model('lessons', LessonModel);