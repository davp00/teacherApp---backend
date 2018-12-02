const mongoose = require('mongoose');


const ActivityModel = new mongoose.Schema({
    title               : { type:String , required: true},
    type                : { type: Number, required: false, default: 1},
    points              : { type: Number, required: false, default: 0},
    _idteacher          : { type: String, required: true},
    groupCode           : { type: Number, required: true},
    code                : { type: Number, required: true},
    comments            : { type: Array, required: false, default: []},
    creation_date       : { type: Date, default: Date.now()},
    finish_date         : { type: Date, required: false, default: undefined},
});


module.exports = mongoose.model('activities', ActivityModel);