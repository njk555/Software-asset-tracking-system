const express = require("express");
const cors = require("cors");
const path = require("path");
const ticketRoutes = require("./routes/ticket.routes");

const authRoutes = require("./routes/auth.routes");
const vendorRoutes = require("./routes/vendor.routes");
const categoryRoutes = require("./routes/category.routes");
const locationRoutes = require("./routes/location.routes");
const departmentRoutes = require("./routes/department.routes");

const employeeRoutes = require("./routes/employee.routes");
const assetRoutes = require("./routes/asset.routes");
const assetImportRoutes = require("./routes/assetImport.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const purchaseOrderRoutes =
require("./routes/purchaseOrder.routes");
const purchaseRequestRoutes = require("./routes/purchaseRequest.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const amcRoutes = require("./routes/amc.routes");

const vendorImportRoutes =
require("./routes/vendorImport.routes");
const locationImportRoutes = require("./routes/locationImport.route");


const departmentImportRoutes =
    require("./routes/departmentImport.route");


const categoryImportRoutes =
require("./routes/categoryImport.route");
const employeeImportRoutes =
require("./routes/employeeImport.route");
const app = express();


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Software Asset Tracking System API is running"
    });
});
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/vendors", vendorRoutes);
app.use("/api/vendors", vendorImportRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/categories", categoryImportRoutes);

app.use("/api/locations", locationRoutes);
app.use("/api/locations", locationImportRoutes);

app.use("/api/departments", departmentRoutes);
app.use("/api/departments", departmentImportRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/employees", employeeImportRoutes);

app.use("/api/assets", assetRoutes);
app.use("/api/assets/import", assetImportRoutes);

app.use(
    "/api/purchase-orders",
    purchaseOrderRoutes
);
app.use("/api/purchase-requests", purchaseRequestRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/amc", amcRoutes);
app.use("/api/tickets", ticketRoutes);
module.exports = app;
