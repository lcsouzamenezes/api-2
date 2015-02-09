var _            = require('underscore');
var locControl   = require('../controllers/location');
var userControl  = require('../controllers/user');
var tweetControl = require('../controllers/tweet');

// New Twitter Connection


// Make this module available to the server.js file
module.exports = function(app) {

    // Route for the root
    // ------------------------------------------------------------------------
    app.route('/')
        // Return welcome message for all requests to '/'
        .all(function(req, res, next) {
            console.log('Root accessed, sending welcome.');
            res.json({ message: 'hooray! welcome to our api!' });
        })

    // Route for /users
    // ------------------------------------------------------------------------
    app.route('/users')
        // create a user (accessed at POST http://localhost:8080/users)
        .post(function(req, res) {
            // Forward the req and res to the user controller and call its post function.
            userControl.post(req, res);
        })

        // get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function(req, res) {
            // Forward the req and res to the user controller and call its get function.
            userControl.get(req, res);
        })

    // Route for /users/:user_id
    // ------------------------------------------------------------------------
    app.route('/users/:user_id')
        // get the user with that id
        // TODO (2/8/15): this is still broken, returns an 
        // error about setting headers after they are sent
        .get(function(req, res) {
            userControl.getUserByID(req, res);
        })

        // update the user with this id
        // TODO (2/8/15): this is still broken, returns an 
        // error about setting headers after they are sent
        .put(function(req, res) {
            userControl.put(req, res);
        })

        // delete the user with this id
        // .delete(function(req, res) {
        //  User.remove({
        //      _id: req.params.user_id
        //  }, function(err, user) {
        //      if (err)
        //          res.send(err);
        //      res.json({ message: 'Successfully deleted' });
        //  });
        // });


    // Route for /locations
    // ------------------------------------------------------------------------
    app.route('/locations')
        // create a location (accessed at POST http://localhost:8080/locations)
        .post(function(req, res) {
            locControl.post(req, res);
        })

        // get all the locations 
        // GET http://localhost:8080/api/locations
        .get(function(req, res) {
            locControl.get(req, res);
        });

    // Route for /locations/:location_id
    // ------------------------------------------------------------------------
    app.route('/locations/:location_id')

        // get the location with that id
        .get(function(req, res) {
            locControl.getLocByID(req, res);
        })

        // update the location with this id
        .put(function(req, res) {
            locControl.put(req, res);
        })

        // delete the location with this id
        // .delete(function(req, res) {
        //  Location.remove({
        //      _id: req.params.location_id
        //  }, function(err, location) {
        //      if (err)
        //          res.send(err);

        //      res.json({ message: 'Successfully deleted' });
        //  });
        // });

    app.route('/twitter/search/:hash')
        .get(function(req, res) {
            tweetControl.getSearch(req, res);
        });

    app.route('/twitter/stream/:hash')
        .get(function(req, res) {
            tweetControl.getStream(req, res);
        });

}

// Set 'Access-Control-Allow-Origin' to header
// TODO: Apply header change to ALL requests
// http://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
setHeaders = function(res){

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    return res;
}
