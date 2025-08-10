const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email:    { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String},
  password: { type: String, required: true },
  profilePhoto: { type: String }, 
  coverPhoto: { type: String },
  registrationSteps:{type:String},
  agreeToTerms:{type:Boolean}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);