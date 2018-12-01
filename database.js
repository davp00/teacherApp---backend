const mongoose = require('mongoose');
const { URI_DATABASE } = require('./config');

mongoose.Promise = global.Promise;

mongoose.connect(URI_DATABASE, { useNewUrlParser: true }).then(
    (stats) =>
    {
        console.log("database connected ");
    }
).catch(
    (error) =>
    {
        console.log(error);
    }
);

module.exports = mongoose;