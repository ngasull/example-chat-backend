var should = require('should')
var request = require('supertest')
var socketioClient = require('socket.io-client')

var ChatBackend = require('..')

var backend = new ChatBackend()
var app = backend.app
backend.setupApiRoutes()

describe('ChatBackend', function () {

    describe('/api/message', function () {

        var basePath = '/api/message'
        var firstMessage, updatedFirstMessage, secondMessage, thirdMessage

        it('GET / should return an empty list', function (done) {
            request(app)
                .get(basePath)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should(err).be.null
                    res.body.should.eql([])
                    done()
                })
        })

        it('POST / should add content and send what is persisted', function (done) {
            request(app)
                .post(basePath)
                .set('Accept', 'application/json')
                .send({
                    author: 'blint',
                    text: 'Hello API',
                    dummyParam: 'foo'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should(err).be.null
                    firstMessage = res.body
                    firstMessage.should.have.property('id')
                    firstMessage.should.have.property('author', 'blint')
                    firstMessage.should.have.property('text', 'Hello API')
                    firstMessage.should.not.have.property('dummyParam')
                    done()
                })
        })

        it('GET /id should return a previously added message by its id', function (done) {
            request(app)
                .get(basePath + '/' + firstMessage.id)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should(err).be.null
                    res.body.should.eql(firstMessage)
                    done()
                })
        })

        it('GET /id should end in error for unknown ids', function (done) {
            request(app)
                .get(basePath + '/42')
                .expect(500)
                .end(function (err) {
                    should(err).be.null
                    done()
                })
        })

        it('PUT / should modify some content', function (done) {
            request(app)
                .put(basePath)
                .set('Accept', 'application/json')
                .send({
                    id: firstMessage.id,
                    author: firstMessage.author,
                    text: 'Hi API!',
                    dummyParam: 'foo'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should(err).be.null

                    updatedFirstMessage = res.body
                    updatedFirstMessage.should.have.property('id', firstMessage.id)
                    updatedFirstMessage.should.have.property('author', firstMessage.author)
                    updatedFirstMessage.should.have.property('text', 'Hi API!')
                    updatedFirstMessage.should.not.have.property('dummyParam')

                    done()
                })
        })

        it('POST / should add a second message', function (done) {
            request(app)
                .post(basePath)
                .set('Accept', 'application/json')
                .send({
                    author: 'Komo',
                    text: 'Welcome'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should(err).be.null
                    secondMessage = res.body
                    done()
                })
        })

        it('POST / should add a third message', function (done) {
            request(app)
                .post(basePath)
                .set('Accept', 'application/json')
                .send({
                    author: 'Bubux',
                    text: 'Hey guys'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should(err).be.null
                    thirdMessage = res.body
                    done()
                })
        })

        it('DELETE / should delete second message', function (done) {
            request(app)
                .delete(basePath + '/' + secondMessage.id)
                .expect(200)
                .end(function (err) {
                    should(err).be.null
                    done()
                })
        })

        it('GET /id should fail returning second message', function (done) {
            request(app)
                .get(basePath + '/' + secondMessage.id)
                .expect(500)
                .end(function (err) {
                    should(err).be.null
                    done()
                })
        })

        it('GET / should return the list of messages with all their modifications', function (done) {
            request(app)
                .get(basePath)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should(err).be.null
                    res.body.should.eql([updatedFirstMessage, thirdMessage])
                    done()
                })
        })
    })

    describe('Real time IO', function () {

        var PORT = 8080
        var socket

        before(function () {
            backend.listen(PORT)
        })

        beforeEach(function (done) {
            socket = socketioClient('http://localhost:' + PORT)
            socket.once('connect', done)
        })

        afterEach(function () {
            socket.close()
        })

        after(function () {
            backend.close()
        })

        it('should send a realtime event on new messages', function (done) {

            var message

            socket.on('message', function (data) {
                should(message).not.be.undefined
                data.should.eql(message)
                done()
            })

            request(app)
                .post('/api/message')
                .set('Accept', 'application/json')
                .send({
                    author: 'blint',
                    text: 'Hello API',
                    dummyParam: 'foo'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should(err).be.null
                    message = res.body
                })
        })
    })
})