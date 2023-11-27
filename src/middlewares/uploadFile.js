import { uploadToCloudinary } from "../configs/clound.config.js";
import { upload } from "../configs/multer.cofig.js";

export const uploadFile = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    console.log(222, req.file);
    const result = await uploadToCloudinary(req.file);
    req.urlUpload = result.url;
    req.body.imageUrl = result.url;
    next();
  } catch (err) {
    console.log("Kiểm tra lỗi", err);
    return res.status(500).json({ error: err });
  }
};
