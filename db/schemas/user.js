// Big thank you goes out to Simon Holmes and Jeremy Wilken
// https://github.com/sitepoint-editors/MEAN-stack-authentication

var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  // You will have to specify a UUID to put as a user
  userid: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  // Date.now() works well for this
  date: {
    type: Date,
    required: true
  },
  hash: String,
  salt: String
});

userSchema.methods.setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = (password) => {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = () => {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, 'secret'); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

userSchema.methods.toAuthJSON = () => {
  return {
    userid: this.userid,
    email: this.email,
    token: this.generateJwt()
  };
}

module.exports = userSchema;