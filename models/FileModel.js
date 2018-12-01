const mongoose = require('mongoose');

const FileModel = new mongoose.Schema({
    _idUser     : {type: String, required: true},
    extension   : { type: String, required:true},
    upload_date : { type: Date, default: Date.now()}
});


module.exports = mongoose.model('files', FileModel);