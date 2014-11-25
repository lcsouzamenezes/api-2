var _          = require('underscore');

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
			
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)

			user.save(function(err) {
				if (err) res.send(err);

				res = setHeaders(res);

				res.json({ message: 'User created!', user : user });
			});
		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {
			console.log('User list requested.');
			User.find(function(err, users) {
				if (err) res.send(err);

				res = setHeaders(res);
				
				res.json(users);
			});
		});

	// Route for /users/:user_id
	// ------------------------------------------------------------------------
	app.route('/users/:user_id')
		// get the user with that id
		.get(function(req, res) {
			console.log('User requested by ID.');
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				res = setHeaders(res);

				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				user.name = req.body.name;
				user.save(function(err) {
					if (err) res.send(err);

					res = setHeaders(res);

					res.json({ message: 'User updated!', user : user });
				});
			});
		})

		// delete the user with this id
		// .delete(function(req, res) {
		// 	User.remove({
		// 		_id: req.params.user_id
		// 	}, function(err, user) {
		// 		if (err)
		// 			res.send(err);
		// 		res.json({ message: 'Successfully deleted' });
		// 	});
		// });


	// Route for /locations
	// ------------------------------------------------------------------------
	app.route('/locations')
		// create a location (accessed at POST http://localhost:8080/locations)
		.post(function(req, res) {

			var location = new Location();	// create a new instance of the Location model

			location.userId = req.body.userId;
			location.latitude = req.body.latitude;
			location.longitude = req.body.longitude;
			location.date = req.body.date;

			console.log("\n POST to /locations:");
			console.log(location);
            
			res = setHeaders(res);

			verifyKeysExist(location, function(err, obj){        
                // Check for an error indicating keys are missing
				if (err) {
                    // Send the missing data error
                    console.log(err);
                    // TODO: this is not sending the error text, not sure why, the rest seems to be working
                    res.send(err, 500);
                }
                else {
                    // Else the data is fine, save it to the database
				    location.save(function(err) {
					    if (err) {
                            res.send(err);
                        }
                        else {
                            console.log("\nLocation created!")
                            res.json({ message: 'Location created!' , location: location});
                        }
				    });
                }
			})
		})

		// get all the locations 
		// GET http://localhost:8080/api/locations
		.get(function(req, res) {
			console.log('\nLocations list requested.');
			Location.find(function(err, locations) {
				if (err) res.send(err);
				res = setHeaders(res);
				res.json(locations);
			});
		});

	// Route for /locations/:location_id
	// ------------------------------------------------------------------------
	app.route('/locations/:location_id')

		// get the location with that id
		.get(function(req, res) {
			console.log('\nLocation requested by ID.');
			Location.findById(req.params.location_id, function(err, location) {
				if (err)
					res.send(err);
				res.json(location);
			});
		})

		// update the location with this id
		.put(function(req, res) {
			Location.findById(req.params.location_id, function(err, location) {
				if (err) res.send(err);
				location.name = req.body.name;
				location.save(function(err) {
					if (err)
						res.send(err);
					res.json({ message: 'Location updated!', location : location});
				});
			});
		})

		// delete the location with this id
		// .delete(function(req, res) {
		// 	Location.remove({
		// 		_id: req.params.location_id
		// 	}, function(err, location) {
		// 		if (err)
		// 			res.send(err);

		// 		res.json({ message: 'Successfully deleted' });
		// 	});
		// });

},

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
},

// Check if all provided keys exist
// (Object to check), (array of strings (keys object has)), (next is call back)
verifyKeysExist = function (object, next) {
    // Extract the actual location data from the JSON object
    // TODO: could also add a hand off of the User data to the same function
    var locData = object._doc;
    // Hand off the location data to check for missing keys
    var missing = missingKeys(locData);
    if (missing.length > 0) {
        return next(new Error('Missing keys -- ' + missing));
    }
    else {
        next(null, object);
    }
};

// Takes an object, and an array of keys (strings)
missingKeys = function(data) {
    // Array to hold the missing keys
    var missingKeys = [];
    // For each key value pair, check if any values are equal to null or ''.
    _.each(data, function(value, key) {
        if(value == null || value == '') {
            // add the missing key to the array
            missingKeys.push(key);
        }
    })
    console.log(missingKeys);
    return missingKeys;
};


// TYPE CHECKING STUB:
// Ignore for now.
/*
    _.each(data, function(value, key) {
        switch(key) {
            case 'userId':
                if(badInput(value, 'string')) missingKeys.push(key);
        }
    })
    // Little helper to make sure the value is the right
    // type and is not null
    var badInput = function(value, type) {
        return ((typeof value != type) || (value == null))
    }
*/
