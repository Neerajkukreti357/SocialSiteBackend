const supabase = require('../config/supabase');

exports.uploadImage = async (req, res) => {

  try {
    // ✅ Ensure we have files
    if (!req.files || (!req.files.profilePhoto && !req.files.coverPhoto)) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Pick the file you want to upload (example: profilePhoto)
    const uploadedFile = req?.files?.profilePhoto?.[0] || req?.files?.coverPhoto?.[0];

    const fileName = `${Date.now()}-${uploadedFile.originalname}`;

    // ✅ Upload file buffer to Supabase Storage
    const { data, error } = await supabase.storage
      .from(req?.files?.profilePhoto?'profilephotos':"coverphotos") // bucket name
      .upload(fileName, uploadedFile.buffer, {
        contentType: uploadedFile.mimetype,
        upsert: false // set to true if you want to overwrite
      });

    if (error) throw error;

    // ✅ Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('profilephotos')
      .getPublicUrl(fileName);

    res.status(201).json({
      message: "Image uploaded successfully",
      url: publicUrlData.publicUrl
    });

  } catch (error) {
    console.error("❌ Upload failed:", error.message);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
