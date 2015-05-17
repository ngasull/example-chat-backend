var express = require('express')
var bodyParser = require('body-parser')
var routeApi = require('./lib/routeApi')
var MessageApi = require('./lib/api/message')

/**
 * Creates the chat express backend.
 * ChatBackend.app can be used to setup routes before calling ChatBackend.setupApiRoutes
 * @constructor
 */
function ChatBackend() {

    this.app = express()
    this.messageApi = new MessageApi()

    this.app.use(bodyParser())
}

/**
 * Configures routes for the API. Top level routes may have been configured before calling this.
 */
ChatBackend.prototype.setupApiRoutes = function () {

    this.app.use('/api/message', routeApi(this.messageApi))
}

module.exports = ChatBackend
