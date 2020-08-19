const express = require('express')
const config = require('config')
const app = express()
const http = require('http').createServer(app)
const PORT = config.get('port')
const path = require('path')
const io = require('socket.io')(http)
require('events').EventEmitter.defaultMaxListeners = Infinity;
app.use(express.static('client'));

let online = 0
let lastGame = []
let timer = 5
let bets = []
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/index.html'))
});

function setTimer(seconds) {
    bets = []
    io.emit('playerBet', {bets: bets})
    let time = setInterval(() => {
        seconds--
        io.emit('timer', {timer: seconds})
        if(seconds <= 0) {
            clearInterval(time)
            start()
        }
    }, 1000);   
}   
setTimer(timer)

function start() {
    let diapazon = Math.floor(Math.random()*10000)
    let random
    if(diapazon <= 5000) {
        random = Math.random()+1
    } else if(diapazon > 5000 && diapazon <= 7500) {
        random = Math.random()*5+1
    } else if(diapazon > 7500 && diapazon <= 8500) {
        random = Math.random()*10+1
    } else if(diapazon > 8500 && diapazon <= 9000) {
        random = Math.random()*20+1
    } else if(diapazon > 9000 && diapazon <= 9750) {
        random = Math.random()*100+1
    } else if(diapazon > 9750 && diapazon <= 10000) {
        random = Math.random()*1000+1
    }
    random = random.toFixed(2)
    console.log(random)
    let num = 1
    let x = setInterval(() => {
        num = num + 0.01
        io.emit('game', {num: num})
        if(num >= random) {
            io.emit('crash', {crash: random})
            lastGame.push(random)
            io.emit('lastGame', {lastGame: lastGame})
            clearInterval(x)
            setTimeout(setTimer, 5000, timer)
        }
    }, 80);
}
io.on('connection', (socket) => {
    console.log('a user connected');
    online++
    io.emit('playerBet', {bets: bets})
    socket.on('bet', (socket) => {
        bets.push({
            name: socket.name,
            bet: socket.bet
        })
        io.emit('playerBet', {bets: bets})
    })
    io.emit('lastGame', {lastGame: lastGame})
    socket.on('disconnect', () => {
        online--
        console.log('user disconnected');
      });
});

http.listen(PORT, () => {
    console.log(`Server has ben started ${PORT}`)
}) 