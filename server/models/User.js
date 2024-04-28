const mongoose = require("mongoose");

const mschema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
  },
  salt: {
    type: String,
  },
  // Add fields for security question and answer
  securityQuestion: {
    type: String,
    required: true,
  },
  securityAnswer: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
