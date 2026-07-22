const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(process.cwd(), "uploads", "invoices");
fs.mkdirSync(uploadDir, { recursive: true });

module.exports = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 100000)}${path.extname(file.originalname)}`),
  }),
  fileFilter: (_, file, cb) => ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Invoices must be PDF, JPG, or PNG files")),
  limits: { fileSize: 10 * 1024 * 1024 },
});
