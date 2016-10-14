var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  id: Schema.ObjectId,
  username: String,
  password: String,
  timestamps: { type: Date, default: Date.now }
});

var User = mongoose.model('User', userSchema);

User.prototype.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

  // var User = db.Model.extend({
  // tableName: 'users',
  // hasTimestamps: true,
  // initialize: function() {
  //   this.on('creating', this.hashPassword);
  // },
  // comparePassword: function(attemptedPassword, callback) {
  //   bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
  //     callback(isMatch);
  //   });
  // },
  // hashPassword: function() {
  //   var cipher = Promise.promisify(bcrypt.hash);
  //   return cipher(this.get('password'), null, null).bind(this)
  //     .then(function(hash) {
  //       this.set('password', hash);
  //     });
  // }
  // });

module.exports = User;
