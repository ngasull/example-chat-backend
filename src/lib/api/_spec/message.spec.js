var should = require('should')
var MessageApi = require('../message')

var rawMessage = {
    author: 'John',
    text: 'Hello world',
    dummyParam: 'foo'
}

describe('MessageApi', function () {

    var messageApi;

    beforeEach(function () {
        messageApi = new MessageApi();
    })

    it('should add a message properly and return the appropriate created object', function () {

        var message = messageApi.add(rawMessage)

        message.should.not.equal(rawMessage)
        message.should.have.property('id')
        message.should.have.property('author', rawMessage.author)
        message.should.have.property('text', rawMessage.text)
        message.should.not.have.property('dummyParam')
    })

    it('should get added messages properly', function () {

        var message = messageApi.add(rawMessage)
        var gottenMessage = messageApi.get(message.id)

        gottenMessage.should.equal(message)
    })

    it('should throw error when getting unknown id', function () {

        messageApi.get.bind(messageApi, 42).should.throw()
    })

    it('should list messages properly', function () {

        var message1 = messageApi.add(rawMessage)
        var message2 = messageApi.add({
            author: 'Jane',
            text: 'Hi John!'
        })

        var messageList = messageApi.list()
        messageList.should.eql([message1, message2])
    })

    it('should update a message properly', function () {

        var message = messageApi.add(rawMessage)

        var messageUpudate = {
            id: message.id,
            author: 'Johnny',
            text: 'Hello Marie',
            dummyProperty: ''
        }

        var updatedMessage = messageApi.update(messageUpudate)

        updatedMessage.should.not.equal(messageUpudate)
        updatedMessage.should.not.equal(message)
        updatedMessage.should.have.property('id', message.id)
        updatedMessage.should.have.property('author', messageUpudate.author)
        updatedMessage.should.have.property('text', messageUpudate.text)
        updatedMessage.should.not.have.property('dummyProperty')

        var gottenUpdated = messageApi.get(message.id)
        gottenUpdated.should.equal(updatedMessage)
    })

    it('should fail to update if the given message actually is unknown', function () {

        messageApi.update.bind(messageApi, {id: 42}).should.throw()
    })

    it('should delete elements properly', function () {

        var rawMessage2 = {
            author: 'Johnny',
            text: 'Hello Marie'
        }

        var message1 = messageApi.add(rawMessage)
        var message2 = messageApi.add(rawMessage2)

        messageApi.list().should.eql([message1, message2])

        messageApi.delete(message1.id)

        messageApi.list().should.eql([message2])
        messageApi.get.bind(messageApi, message1.id).should.throw()

        messageApi.delete(message2.id)

        messageApi.list().should.eql([])
    })
})