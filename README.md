node-registration
=================

Simple and robust user registraion process with expressjs + mongoose + nodemailer + more...

[Passport](http://passportjs.org) does some thing really nice for authentication in Node.js, but the registration process may also be a pain. 

What [node-registration](https://github.com/xufeng123/node-registration) dose is to provide a simple way to finish the normal registration process with high security.

Dependencies:

1. express3 for the entire framework
2. mongoose for database
3. bcrypt for hash
4. nodemailer for email confirmation 
5. passport for authentication

Thanks [passportjs](http://passportjs.org) for making authentication less of pain and also leaving a complete example. This project is modified on top of the passport-local example with express3-mongoose-rememberme.

The main workflow is as following:

```
Index Page -> 
  if( login ) -> show the welcome message
  if( !login ) ->
    user give email adress ->
    user receive a confirmation email ->
      user click the activate page ->
        sign up page -> (with email field pre-filled)
          user complete necessary information
          -> info saved
          -> login
          -> logout
```
More inforation to be added.


