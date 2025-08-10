const bcrypt = require('bcrypt');
const User = require('../models/Users.js');

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


async function loginUser({
  email,
  password,
}) {
  const user = User.findOne({email})
  if(!user) throw("User does not exist with this email.");

  const isMatch = bcrypt.compare(password,user?.password);
  if(!isMatch) throw("Please enter correct password.")

}

module.exports = { registerUser,loginUser };
