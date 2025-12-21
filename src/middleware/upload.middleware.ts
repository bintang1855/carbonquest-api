import multer from "multer";
import path from "path";
import fs from "fs";

// Pastikan folder uploads ada
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter file types (hanya gambar)
const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const allowedExtensions = /jpeg|jpg|png|gif|webp/;

  // Check MIME type
  const mimetypeValid = allowedMimeTypes.includes(file.mimetype.toLowerCase());

  // Check extension (jika ada)
  const extname = file.originalname
    ? allowedExtensions.test(path.extname(file.originalname).toLowerCase())
    : false;

  // Accept jika MIME type valid ATAU extension valid
  // Flutter sering send tanpa proper extension, jadi MIME type lebih reliable
  if (mimetypeValid || extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        `Only image files are allowed! Received mimetype: ${file.mimetype}`
      )
    );
  }
};

// Konfigurasi multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024, // Max 30MB
  },
});
