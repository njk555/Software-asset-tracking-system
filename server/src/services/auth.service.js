const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (userData) => {

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
        data: {
            fullName: userData.fullName,
            email: userData.email,
            password: hashedPassword,
            role: userData.role
        }
    });

    return user;
};

const loginUser = async ({ email, password }) => {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = {
    registerUser,
    loginUser
};