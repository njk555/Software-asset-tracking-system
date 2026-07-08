const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");

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

module.exports = {
    registerUser
};