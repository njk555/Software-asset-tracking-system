const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

const {
    importCategoryExcel
} = require("../controllers/categoryImport.controller");

router.post(
    "/import",
    upload.single("file"),
    importCategoryExcel
);

module.exports = router;