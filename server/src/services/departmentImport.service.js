const XLSX = require("xlsx");
const prisma = require("../prisma/client");

const importDepartments = async (filePath) => {

    const workbook = XLSX.readFile(filePath);

    const sheet =
        workbook.Sheets[
            workbook.SheetNames[0]
        ];

    const rows =
        XLSX.utils.sheet_to_json(sheet);

    let imported = 0;

    for (const row of rows) {

        const departmentName =
            row.name || row.Name;

        if (!departmentName) continue;

        const exists =
            await prisma.department.findFirst({

                where: {
                    name: departmentName,
                },

            });

        if (exists) continue;

        await prisma.department.create({
    data: {
        name: departmentName,
        description:
            row.description ||
            row.Description ||
            "",

        manager:
            row.manager ||
            row.Manager ||
            null,
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
    importDepartments,
};