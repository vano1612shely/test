const express = require('express')
const app = express()
const http = require('http').createServer(app)
const config = require('config')
const indexRouter = require('./routes/index.router.js')
const PORT = config.get('port')
app.use(express.static(__dirname + '/client'))

app.use('/', indexRouter)

http.listen(PORT, () => {
    console.log(`Sever has been started on port: ${PORT}`)
})

// rgb(24, 241, 255)
// rgb(255, 180, 0)
// rgb(242, 78, 186)
// rgb(190, 78, 242)
// rgb(141, 76, 248)
// rgb(78, 94, 242)
// rgb(242, 78, 78)

//#161924
//#1d202b