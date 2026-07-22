const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload = multer({
    dest: "uploads/",
});

const {
    importLocationExcel,
} = require("../controllers/locationImport.controller");

router.post(
    "/import",
    upload.single("file"),
    importLocationExcel
);

module.exports = router;