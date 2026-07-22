const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(process.cwd(), "uploads", "purchase-requests");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 100000)}${path.extname(file.originalname)}`),
});

const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

module.exports = multer({
  storage,
  fileFilter: (_, file, cb) => allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Quotations must be PDF, JPG, or PNG files")),
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
});
