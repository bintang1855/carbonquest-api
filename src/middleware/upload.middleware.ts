import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const ALLOWED_EXTENSIONS = /jpeg|jpg|png|gif|webp/;

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const mimetypeValid = ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase());
  const extname = file.originalname
    ? ALLOWED_EXTENSIONS.test(path.extname(file.originalname).toLowerCase())
    : false;

  if (mimetypeValid || extname) {
    return cb(null, true);
  }
  
  cb(new Error(`Only image files are allowed! Received mimetype: ${file.mimetype}`));
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
});
