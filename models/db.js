var mongodb = require('mongodb')
  , mongoose = require('mongoose');

var dbUrl = "localhost"
  , dbName = "test";

mongoose.connect(dbUrl, dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

exports.mongoose = mongoose;