const express = require('express')
const { createServer } = require('http');
const session = require('express-session')
const route = require('./routes')
// const socket = require('./services/socket.service')
const pg = require('pg')
const pgSession = require('connect-pg-simple')(session)

const { Server } = require('socket.io')
require('dotenv').config()
const SocketIO = require('./services/socket.service')



const app = express();
const httpServer = createServer(app)
const PORT = 3000;
const io = new Server(httpServer)
const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
})

global._io = io;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', './src/pages')


app.use(session({
    store: new pgSession({
        pool : pgPool,                // Connection pool
        tableName : 'user_sessions',
        createTableIfMissing: true   // Use another table-name than the default "session" one
        // Insert connect-pg-simple options here
      }),
    secret: "session secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        // secure: true,
        maxAge: 60 * 60 * 1000
    }
}))
app.use(route);

io.use(SocketIO.auth)
io.on('connection', SocketIO.connection);


app.use(express.static('public'))

app.use((err, req, res, next) => {
    res.redirect('/login')
})

// console.log(socket)
httpServer.listen(PORT, () => {
    console.log(`Server is listen on PORT :: ${PORT}`)
})

