var express = require('express')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var siteUrl = 'localhost:3000';

var User = require('./models/user').User;
var As = require('./models/activate').As;
var smtpTransport = require('./models/mail').smtpTransport;

passport.serializeUser(function(user, done) {
  var createAccessToken = function () {
    var token = user.generateRandomToken();
    User.findOne( { accessToken: token }, function (err, existingUser) {
      if (err) { return done( err ); }
      if (existingUser) {
        createAccessToken(); // Run the function again - the token has to be unique!
      } else {
        user.set('accessToken', token);
        user.save( function (err) {
          if (err) return done(err);
          return done(null, user.get('accessToken'));
        })
      }
    });
  };

  if ( user._id ) {
    createAccessToken();
  };
});

passport.deserializeUser(function(token, done) {
  User.findOne( {accessToken: token } , function (err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) {return done(err);};
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));


var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', require('ejs-locals'));
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' })); // CHANGE THIS SECRET!
  // Remember Me middleware
  app.use( function (req, res, next) {
    if ( req.method == 'POST' && req.url == '/login' ) {
      if ( req.body.rememberme ) {
        req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
      } else {
        req.session.cookie.expires = false;
      }
    }
    next();
  });
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});

// index router
app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

// activate router
app.post('/activate', checkStatus ,function(req, res) {
  var _mail = req.body.email;
  var activationStatus = new As({ email: _mail, hashedEmail: _mail, verifyStatus: false });
  activationStatus.save(function(err, data) {
    if(err) {
      return next(err);
    } else {
      var mailOptions = {
        from: 'Fraser Xu ✔ ' + auth_email, // sender address
        to: data.email, // list of receivers
        subject: "Signup Confirmation ✔", // Subject line
        text: "Signup Confirmation ✔", // plaintext body
        html: '<b>Signup Confirmation ✔</b><br />'
            + 'Your email account is : ' + data.email + '<br />'
            + '<a href="'+ siteUrl +'/signup?token=' + data.hashedEmail + '">Click here to activate your account.</a>'
      };
      smtpTransport.sendMail(mailOptions);
      res.send('We have just drop you an email, please check your mail to avtivate your account!');
    }
  });  
});

// signup get router
app.get('/signup', spamMid, function(req, res) {
  var token = req.query["token"];
  As.findOne({ hashedEmail: token }, function(err, data) {
    if(err) { return next(err) };
    if(!data) {
      res.send('Token not found. Where are u come from?')
    } else {
      var _email = data.email;
      if ( data.verifyStatus == true) {
        res.send('Your account has already been activated. Just head to the login page.');
      } else {
        res.render('signup_token', { message: 'Please signup', email: _email });  
      }  
    };
  });  
})

// signup post router
app.post('/signup', function(req, res, next) {
  var usr = new User({ username: req.body.username, email: req.body.email, password: req.body.password });
  User.findOne({username: usr.username}, function(err, data) {
    if(err) return next(err);
    if(data) {
      res.send('Oops, this username has been taken. Please try another one.');
    } else {
      usr.save(function(err) {
        if(err) {
          return next(err);
        } else {
          As.update({email: usr.email}, {verifyStatus: true}, function(err) {
            if(err) return next(err);
          })
          res.redirect('/login');
        }
      });  
    };
  });
  
});

// login get router
app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.session.messages });
});

// login post router
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

// account get router
app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

// account logout router
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000, function() {
  console.log('Express server listening on port 3000');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Status check middleware. Check if confirmation email has send before
// note that the data will be expired in 1.5h, so the user can only be send another email after 1.5h
// If there's no record in the database, then create a new recoad for the emailStatus
function checkStatus(req, res, next) {
  As.findOne({ email: req.body.email }, function(err, data) {
    if (err) { 
      return next(err); 
    } else if ( data === null) {
      return( next() );
    } else if ( data.verifyStatus === true ) {
      res.send('Your account has already been activated. Just head to the login page.');
    } else {
      res.send('An email has been send before, please check your mail to activate your account. Note that you can only get another mail after 1.5h. Thanks!');
    }
  });  
}

// spamMid middleware.
// to stop user from register the second time
function spamMid(req, res, next) {
  var token = req.query["token"];
  if (token == undefined) {
    res.render('signup');
  } else {
    return( next() );
  }
}

