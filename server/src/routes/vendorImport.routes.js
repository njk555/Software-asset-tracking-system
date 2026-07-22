const express = require("express");
const multer = require("multer");
const controller = require("../controllers/vendorImport.controller");

const router = express.Router();

const upload = multer({
    dest: "uploads/",
});

router.post(
    "/import",
    upload.single("file"),
    controller.importVendorExcel
);

module.exports = router;