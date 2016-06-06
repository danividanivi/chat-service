/**
 * Created by juancarlosmateosanchez on 7/5/16.
 */

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require("socket.io").listen(server),
    nicknames = {};

server.listen(8000);
//server.listen(process.env.PORT, process.env.IP);
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.sockets.on('connection', function(socket) {
    socket.on('send message', function(data) {
        io.sockets.emit('new message', {msg: data, nick: socket.nickname});
    });

    socket.on('new user', function(data, callback) {
        if (data in nicknames) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames[socket.nickname] = 1;
            updateNickNames();
        }
    });

    socket.on('disconnect', function(data) {
        if(!socket.nickname) return;
        delete nicknames[socket.nickname];
        updateNickNames();
    });

    function updateNickNames() {
        io.sockets.emit('usernames', nicknames);
    }
});