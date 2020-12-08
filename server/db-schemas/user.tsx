// Big thank you goes out to Simon Holmes and Jeremy Wilken
// https://github.com/sitepoint-editors/MEAN-stack-authentication

var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  // You will have to specify a UUID to put as a user
  role: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  confirmed: {
    type: Boolean,
    required: true
  },
  // Date.now() works well for this
  date: {
    type: Date,
    required: true
  },
  writtenBlogs: {
    type: Array,
    required: true
  },
  starredBlogs: {
    type: Array,
    required: true
  },
  comments: {
    type: Array,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    unique: true,
    required: true
  },
  salt: {
    type: String,
    unique: true,
    required: true
  }
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 3);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    exp: expiry.getTime() / 1000,
  }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

userSchema.methods.validateJWT = function (token) {
  try {
    // verify token with the environment variable secret
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("Invalid Token");
    return null;
  }
}

// brash workaround - probably shouldn't do this
var userModel;
try {
  userModel = mongoose.model('User');
} catch (error) {
  userModel = mongoose.model('User', userSchema);
}

export default userModel;