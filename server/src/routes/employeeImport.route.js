const express = require("express");
const multer = require("multer");

const {
    importEmployeeExcel,
} = require("../controllers/employeeImport.controller");

const router = express.Router();

const upload = multer({

    dest: "uploads/",

});

router.post(

    "/import",

    upload.single("file"),

    importEmployeeExcel

);

module.exports = router;