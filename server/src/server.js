require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("=====================================");
    console.log(" Software Asset Tracking System API");
    console.log("=====================================");
    console.log(` Server running at http://localhost:${PORT}`);
});