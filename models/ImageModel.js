const mongoose = require('mongoose');


const ImageModel = new mongoose.Schema({
    _idUser     : { type: String, required: true},
    extension   : { type: String, required: true},
    size        : { type: Number, required: false},
    orginalName : { type: String, required: false}
});


module.exports = mongoose.model('images', ImageModel);