/**
 * Instantiates the MessageApi
 * @param {ChatBackend} the backend app
 * @constructor
 */
function MessageApi(backend) {

    this.backend = backend

    // Simple storage / cache
    this.messages = []
    this.index = {}
    this.sequence = 0
}

/**
 * Get a message
 * @param id the id of the message
 * @returns {Object} the message
 * @throws Error if id doesn't match any message
 */
MessageApi.prototype.get = function (id) {
    var message = this.index[id]

    if (message)
        return message
    else
        throw Error('Message #' + id + ' not found')
}

/**
 * List all messages
 * @returns {Array.<Object>} of messages
 */
MessageApi.prototype.list = function () {
    // Return a copy of the messages array
    return this.messages.slice()
}

/**
 * Adds a message
 * @param message the raw message object
 * @returns {Object} the new message object
 */
MessageApi.prototype.add = function (message) {

    this.sequence++
    var newMessage = copyMessage(this.sequence, message)

    this.index[this.sequence] = newMessage
    this.messages.push(newMessage)

    if (this.backend) this.backend.notifyMessage(newMessage)

    return newMessage
}

/**
 * Updates a given message
 * @param message the previous message object (update based on message.id)
 * @returns {Object} the new and updated message object (same id as before)
 */
MessageApi.prototype.update = function (message) {

    var originalMessage = this.get(message.id)
    var updatedMessage = copyMessage(originalMessage.id, message)

    // Update the index
    this.index[originalMessage.id] = updatedMessage

    // Replace the old message in the list
    this.messages.splice(this.messages.indexOf(originalMessage), 1, updatedMessage)

    return updatedMessage
}

/**
 * Deletes a message by its id
 * @param id the id of the message
 * @throws {Error} when the id does not match any message
 */
MessageApi.prototype.delete = function (id) {

    var message = this.get(id)
    delete this.index[id]
    this.messages.splice(this.messages.indexOf(message), 1)
}

module.exports = MessageApi

// Privates

function copyMessage(id, message) {

    return {
        id: id,
        author: message.author,
        text: message.text
    }
}
