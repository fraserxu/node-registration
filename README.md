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
More information to be added.

## License

(The MIT License)

Copyright (c) 2013 Fraser Xu fraserxv@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


