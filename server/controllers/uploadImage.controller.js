import uploadImage from "../utils/uploadImage.js";

const uploadImageController = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file provided",
        error: true,
        success: false,
      });
    }

    const imageUrl = await uploadImage(file);

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

export default uploadImageController;
