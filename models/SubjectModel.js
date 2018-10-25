const mongoose = require('mongoose');

const SubjectModel = new mongoose.Schema(
    {
        name: { type: String, required: true},
        credits: {type: Number, required: true},
        optional: {type:Boolean, required: false, default:false}
    }
);

module.exports = mongoose.model('subjects', SubjectModel);