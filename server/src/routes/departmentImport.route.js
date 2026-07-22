const express = require("express");
const multer = require("multer");

const {
    importDepartmentExcel,
} = require("../controllers/departmentImport.controller");

const router = express.Router();

const upload = multer({
    dest: "uploads/",
});

router.post(
    "/import",
    upload.single("file"),
    importDepartmentExcel
);

module.exports = router;