var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

const userSchema = new mongoose.Schema({
  f_name: String,
  l_name: String,
  email: String,
  password: String,
  image_url: String,
  role: String,
});
const User = mongoose.model("User", userSchema);

// hash the password
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
module.exports = User;
