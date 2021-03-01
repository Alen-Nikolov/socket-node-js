const app = require('express')();
const http = require('http').Server(app);
const cors = require('cors')

app.use(cors())

const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        allowedHeaders: ["content-type"]
    },
    // ...Or the old `allowRequest` function.
    allowRequest: function(req, callback) {
        callback(null, req.headers.referer.startsWith("http://localhost:4200"));
    }
});

app.get('/', function (req, res) {
    res.send({msg: 'hello world'})
})

io.on("connection", socket => {
    console.log('Connection established')
    const message =  {name: 'Hello', message: 'This is from the server, through the socket!'}
    io.emit("message", message);

    socket.on("message", (data) => {
        console.log(data)
        for(let i = 0; i< 3; i++) {
            io.emit("message", i);
        }
    });

});

console.log('Listening on 3000:')
http.listen(3000);
