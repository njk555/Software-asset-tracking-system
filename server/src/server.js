require("dotenv").config();

const app = require("./app");
const amcService = require("./services/amc.service");
const departmentRoutes = require("./routes/department.routes");
app.use("/api/departments", departmentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("=====================================");
    console.log(" Software Asset Tracking System API");
    console.log("=====================================");
    console.log(` Server running at http://localhost:${PORT}`);
    amcService.processReminders().catch((error) => console.error("AMC reminder check failed:", error.message));
});

// Runs once per day while the API is online. Notification records are idempotent.
setInterval(() => {
    amcService.processReminders().catch((error) => console.error("AMC reminder check failed:", error.message));
}, 24 * 60 * 60 * 1000);
