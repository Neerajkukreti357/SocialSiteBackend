const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware with error handling
const uploadMiddleware = (req, res, next) => {
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Known Multer error
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // Unknown error
      return res.status(500).json({ message: "File upload failed", error: err.message });
    }
    next();
  });
};

module.exports = uploadMiddleware;
