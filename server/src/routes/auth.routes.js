const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

router.get("/health", (req, res) => {
    res.json({
        success: true,
        module: "Authentication",
        status: "Ready"
    });
});

router.post("/register", authController.register);

// NEW
router.post("/login", authController.login);
router.post("/login", authController.login);

module.exports = router;