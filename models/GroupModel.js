const mongoose = require('mongoose');
const moment = require('moment');

const GroupModel = new mongoose.Schema(
    {
        _idteacher: { type:String, required: true},
        _idsubject: { type: String, required: true},
        number: {type: Number, required: true},
        code: {type:Number, required: false, default:moment().unix()},
        students: { type: Array, required: false, default: []},
        lessons: { type: Array, default: []}
    }
);

module.exports = mongoose.model('groups', GroupModel);