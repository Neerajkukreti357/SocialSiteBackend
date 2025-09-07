const bcrypt = require('bcrypt');
const User = require('../models/Users.js');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d'; // or '30d' depending on your UX needs



async function registerUser({
  firstName,
  lastName,
  email,
  password,
  registrationSteps,
  userName,
  profilePhoto,
  coverPhoto,
  agreeToTerms
}) {
  // Step 1 → userName (required), profilePhoto (optional), coverPhoto (optional)


  if (registrationSteps === "Step_2") {
    if (!userName) throw new Error("Username is required.");
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Match user by email
      {
        $set: {
          userName,
          profilePhoto: profilePhoto || null,
          coverPhoto: coverPhoto || null,
          registrationSteps: "Step_2"
        }
      },
      { new: true, runValidators: true }
    );
    
    console.log("AAAADASSSSADDASD",updatedUser)
    return updatedUser;
  }

  // Step 2 → password (required), agreeToTerms (required)
  if (registrationSteps === "Step_3") {
    if (!password) throw new Error("Password is required for Step 2");
    if (!agreeToTerms) throw new Error("You must agree to terms");

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hashedPassword,
          agreeToTerms,
          registrationSteps: "Complete"
        }
      },
      { new: true, runValidators: true }
    );

    return updatedUser;
  }

  // Initial registration (only email, firstName, lastName)
  if (registrationSteps === "Step_1") {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          email,
          firstName,
          lastName,
          registrationSteps: "Step_1"
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    return updatedUser;
  }

  throw new Error("Invalid registration step");
}


async function loginUser({ email, password }) {
  const user = await User.findOne({ email });

  if (!user) throw new Error('User does not exist with this email.');

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error('Please enter correct password.');

  // ✅ Generate Access Token
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );


  // ✅ Generate Refresh Token
  const refreshToken = jwt.sign(
    { id: user._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  // ✅ Optional: Save refresh token in DB (user.sessions, etc.)
  // user.refreshToken = refreshToken;
  // await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      username: user.userName, // or whatever other fields you want
    }
  };
}

module.exports = { registerUser,loginUser };
