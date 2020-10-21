const connectionString = 'mongodb+srv://gabepetersen:Granolaandwine@12pm@cluster0.wr4vp.mongodb.net/primary?retryWrites=true&w=majority';

const mongoose = require('mongoose');
const userSchema = require('./schemas/user.js');
const User = mongoose.model('user', userSchema, 'user');

const { v4: UUID } = require('uuid');

mongoose.connect(connectionString, {useNewUrlParser: true});

// grab the db connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  
  // create the new user
  const newUser = new User();
  newUser.userid = UUID();
  newUser.email = "gabe@gabe.com";
  newUser.date = Date.now();
  newUser.setPassword('yeet');

  await newUser.save(function (err, user) {
    if (err) {
      return console.error(err);
    }
    console.log(user);
  });

  await User.find(function (err, users) {
    if (err) return console.error(err);
    console.log(users);
  });

});




