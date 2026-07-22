const dashboardService = require("../services/dashboard.service");

const getDashboard = async (req, res) => {

    try {

        const dashboard = await dashboardService.getDashboard();

        return res.status(200).json({

            success: true,

            data: dashboard

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Failed to load dashboard",

            error: error.message

        });

    }

};

module.exports = {

    getDashboard

};