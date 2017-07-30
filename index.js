// ===============Packages====================
const express = require('express');
const expresshandlebars = require('express-handlebars');
const bodyparser = require('body-parser');
const expressvalidator = require('express-validator')
const session = require('express-session');
const app = express();


// ************BOILER PLATE*****************

// for handlebars
app.engine('handlebars', expresshandlebars());
app.set('views', './views');
app.set('view engine', 'handlebars');


// for express-session
app.use(
  session({
    // fyi not the correct way to store passwords in the future, just for this lesson
    secret: 'mySecretPassword$',
    resave: false, //doesn't save without changes
    saveUnitialized: true //creates a session
  })
);

// for express-session
app.use(express.static('public'));


// for body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: false
}));

// for express-validator
app.use(expressvalidator());


// ========Usernames/Passwords==========

let topsecret = [{
    username: 'Georgia',
    password: '1234'
  },

  {
    username: 'Scott',
    password: '5678'
  },

  {
    username: 'Reggie',
    password: '91011'
  }
]
// **************ENDPOINTS***********

// / path to home
app.get('/', function(req, res) {
  if(!req.session.victim) {
    res.redirect('/login')
  } else {
    res.render('login',{
      username: req.session.victim
    });
  }
  // res.send("You're home!")
});

// path to login
app.get('/login', function(req, res) {
  res.render('login')
});

// send information after it is submitted
app.post('/login', function(req, res) {
  let user = req.body;


  // ==============Validation=============
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Need your password!').notEmpty();
  //
  let errors = req.validationErrors();
  //
  if (errors) {
    // If there is an error print this
    res.render('login', {
      errors: errors
    });
  } else {
    // ...or this
    let users = topsecret.filter(function(usercheck) {
      return usercheck.username === req.body.username;
    });

    // if that user doesn't exist, return an error to the user
    if (users.length === 0) {
      let not_a_user = "User not found. Please create an account."
      res.render('login', {
        notausermessage: not_a_user
      });
      return;
    }

    let user = users[0];

    // if the passwords match direct to the home page
    if (user.password === req.body.password) {
      req.session.victim = user.username;
      res.redirect('/');
    } else {
      let not_ur_password = "Poof"
      res.render('login', {
        something: not_ur_password
      });
    }
  }
});
// **************LISTEN*************


app.listen(3000, function() {
  console.log('App is running')
});
