module.exports = (io) =>
{
    io.on('connection', (socket) =>
    {
        socket.on('user', (user) =>
        {
            socket.user = user;
            socket.rooms = [];
        });

        socket.on('activity', (activity) =>
        {
            socket.join('activity#'+activity);
        });

        socket.on('activity:comment', (data) =>
        {
            data.date = new Date();
            io.sockets.in('activity#'+data.code).emit('activity:newcomment',{data, user:socket.user});
        });
    });

};