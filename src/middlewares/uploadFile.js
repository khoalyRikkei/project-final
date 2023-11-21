import { uploadToCloudinary } from "../configs/clound.config.js";

export const uploadFile = async (req, res, next) => {
  console.log(111111);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    console.log(222, req.file);
    const result = await uploadToCloudinary(req.file);
    req.urlUpload = result.url;
    next();
  } catch (err) {
    console.log("Kiểm tra lỗi", err);
    return res.status(500).json({ error: err });
  }
};
