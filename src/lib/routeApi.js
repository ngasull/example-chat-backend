var express = require('express')

/**
 * Routes express requests for a given api and route
 * @param api API that should implement get, list, post, update and delete methods.
 * @returns route The express route ready to bind.
 */
function routeApi(api) {

    var route = express.Router()

    route
        .get('/', function (req, res) {

            res.json(api.list())
        })

        .get('/:id', function (req, res) {

            var id = parseInt(req.params.id)
            res.json(api.get(id))
        })

        .post('/', function (req, res) {

            res.json(api.add(req.body))
        })

        .put('/', function (req, res) {

            res.json(api.update(req.body))
        })

        .delete('/:id', function (req, res) {

            api.delete(req.params.id)
            res.send()
        })

    return route
}

module.exports = routeApi;
