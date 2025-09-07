const { registerUser, loginUser } = require('../services/UserService');

exports.register = async (req, res) => {
  try {
    const { firstName,
  lastName,
  email,
  password,
  registrationSteps,
  userName,
  profilePhoto,
  coverPhoto,
  agreeToTerms } = req.body;

    const user = await registerUser({ firstName,
  lastName,
  email,
  password,
  registrationSteps,
  userName,
  profilePhoto,
  coverPhoto,
  agreeToTerms });

    res.status(201).json({
      message: 'User registered successfully.'
    });
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { 
  email,
  password,
   } = req.body;

    const user = await loginUser({ 
  email,
  password,
   });

    res.status(200).json({
      message: 'User logged in successfully.',
      user
    });
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};