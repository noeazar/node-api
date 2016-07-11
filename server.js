var express = require('express');        
var app = express();                 
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 

var mongoose   = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/test');
mongoose.connect('mongodb://noeazar:pass@ds047692.mlab.com:47692/node-api');

var User     = require('./app/models/user');

// ROUTES 
var router = express.Router(); 

// run when route hit
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// test route (GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Cool the API is working!' });   
});

router.route('/users')
    // create a user (POST http://localhost:8080/api/users)
    .post(function(req, res) { 
        var user = new User();     
        user.name = req.body.name;  
        user.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'User created!' });
        });
    })

    // get all the users (GET http://localhost:8080/api/users)
    .get(function(req, res) {
        User.find(function(err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    });

   
router.route('/users/:user_id')

    // get user by id (GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err){
                res.send(err);
            }
            res.json(user);
        });
    })

    // update user by id (PUT http://localhost:8080/api/users/:user_id)
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err){
                res.send(err);
            }
            user.name = req.body.name;
            user.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'User updated!' });
            });

        });
    })

    // delete user by id (DELETE http://localhost:8080/api/user/:user_id)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    });

// prefixe route with /api
app.use('/api', router);

app.listen(port);
console.log('Port ' + port+ ' is live!');