const mongoose = require('mongoose');

const UserModel = new mongoose.Schema(
    {
        email:          { type: String, required: true},
        pass:           { type: String, required: true},
        code:           { type: String, required: false},
        name:           { type: String, required: true},
        phone:          { type: String, required: true},
        type:           { type: Number, required: true},
        img_url:        { type: String, required: false},
        groups:         { type: Array,  required: false, default: []},
        creation_date:  { type: Date,   default: Date.now},
        recovery_token: { type: String, required: false, default: undefined}
    }
);

module.exports = mongoose.model('users', UserModel);