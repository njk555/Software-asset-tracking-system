const vendorRoutes = require("./routes/vendor.routes");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Software Asset Tracking System API is running"
    });

});

app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);


module.exports = app;