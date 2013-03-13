var mongoose = require('./db').mongoose
  , SALT_WORK_FACTOR = 10
  , bcrypt = require('bcrypt');

// Activation Schema
var activationSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},
  hashedEmail: { type: String, required: true, unique: true },
  verifyStatus: Boolean, // Used to check status
  createdAt: { type: Date, expires: '1.5h' }
});

activationSchema.pre('save', function(next) {
  var _status = this;

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(_status.email, salt, function(err, hash) {
      if(err) return next(err);
      _status.hashedEmail = hash;
      next();
    });
  });
});

// Activation Status
var As = mongoose.model('As', activationSchema);

// Expose Activation Status
exports.As = As;