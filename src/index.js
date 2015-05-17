var express = require('express')
var socketio = require('socket.io')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var routeApi = require('./lib/routeApi')
var MessageApi = require('./lib/api/message')

/**
 * Creates the chat express backend.
 * ChatBackend.app can be used to setup routes before calling ChatBackend.setupApiRoutes
 * @constructor
 */
function ChatBackend() {

    this.app = express()
    this.messageApi = new MessageApi(this)

    this.app.use(bodyParser.json())
    this.app.use(morgan('dev'))
}

/**
 * Configures routes for the API. Top level routes may have been configured before calling this.
 */
ChatBackend.prototype.setupApiRoutes = function () {

    this.app.use('/api/message', routeApi(this.messageApi))
}

/**
 * Listens on the given port
 * @param port
 */
ChatBackend.prototype.listen = function (port) {

    this.server = this.app.listen(port)
    this.io = socketio(this.server)

    this.io.on('connection', function (socket) {
        socket.join('chat')
    })
}

/**
 * Close open sockets
 */
ChatBackend.prototype.close = function () {

    this.server.close()
    delete this.server
    delete this.io
}

/**
 * Notifies connected users of a message
 * @param message
 */
ChatBackend.prototype.notifyMessage = function (message) {

    if (this.io) {
        this.io.to('chat').emit('message', message)
    }
}

module.exports = ChatBackend
