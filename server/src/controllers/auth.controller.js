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

const login = async (req, res) => {

    try {

        const result = await authService.loginUser(req.body);

        res.json({
            success: true,
            message: "Login Successful",
            data: result
        });

    } catch (error) {

        res.status(401).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    register,
    login
};