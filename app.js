const express = require('express');
const app = express();

const cors = require('cors');
const morgan = require('morgan');

const config = require('./config');

// Server config
    const http = require('http');
    const server = http.createServer(app);
    const dbMongo = require('./database');
    const formidable = require('express-form-data');
    const bodyParser = require('body-parser');
    const io         = require('socket.io').listen(server);
    const socketChat = require('./sockets/activity.chat')(io);
//


// MiddleWares
    if(config.DEV)app.use(morgan('dev'));
    app.use(express.json());
    app.use(cors({origin: config.URL_FRONT}));
    app.use(formidable.parse({ keepExtensions: true }));

    app.use(express.static('./public'));
//


// Routes
    app.use('/api/users', require('./routes/user.routes'));
    app.use('/api/teacher', require('./routes/teacher.routes'));
    app.use('/api/students', require('./routes/students.routes'));
    app.use('/api/activities', require('./routes/activity.routes'));
//


//server running

server.listen(config.port, () =>
{
    console.log('Server running on port', config.port);
});
