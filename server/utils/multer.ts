import multer from "multer";
import path from "path";

// Configure storage for multer to save images in 'images/webdata/'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/webdata"); // Directory where the images will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension); // Generate unique file name
  },
});

// Initialize multer with the storage configuration
export const upload = multer({ storage: storage });
