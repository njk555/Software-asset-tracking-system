const XLSX = require("xlsx");
const prisma = require("../prisma/client");

const importEmployees = async (filePath) => {

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let imported = 0;

    for (const row of rows) {

        if (!row.employeeCode) continue;

        const existing = await prisma.employee.findFirst({
            where: {
                employeeCode: String(row.employeeCode),
            },
        });

        if (existing) continue;

        // Find Department
        const department = await prisma.department.findFirst({
            where: {
                name: String(row.department).trim(),
            },
        });

        if (!department) {
            console.log(`Department not found: ${row.department}`);
            continue;
        }

        // Find Location
        const location = await prisma.location.findFirst({
            where: {
                name: String(row.location).trim(),
            },
        });

        if (!location) {
            console.log(`Location not found: ${row.location}`);
            continue;
        }

        await prisma.employee.create({

            data: {

                employeeCode: String(row.employeeCode),

                firstName: row.firstName || "",

                lastName: row.lastName || "",

                email: row.email || "",

                phone: row.phone ? String(row.phone) : null,

                designation: row.designation || null,

                departmentId: department.id,

                locationId: location.id,

                joiningDate: row.joiningDate
                    ? new Date(row.joiningDate)
                    : null,

                isActive:
                    String(row.isActive).toLowerCase() === "true",

            },

        });

        imported++;

    }

    return {

        success: true,

        imported,

    };

};

module.exports = {
    importEmployees,
};