const authService = require("../services/auth.service");

const register = async (req, res) => {

    try {

        const user = await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    register
};