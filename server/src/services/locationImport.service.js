const XLSX = require("xlsx");
const prisma = require("../prisma/client");

const importLocations = async (filePath) => {

    const workbook = XLSX.readFile(filePath);

    const sheet =
        workbook.Sheets[
            workbook.SheetNames[0]
        ];

    const rows =
        XLSX.utils.sheet_to_json(sheet);

    let imported = 0;

    for (const row of rows) {

        const locationName =
            row.name || row.Name;

        if (!locationName) continue;

        const exists =
            await prisma.location.findFirst({

                where: {
                    name: locationName,
                },

            });

        if (exists) continue;

        await prisma.location.create({

            data: {

                name: locationName,

                building:
                    row.building ||
                    row.Building ||
                    "",

                floor:
                    row.floor ||
                    row.Floor ||
                    "",

                room:
                    row.room ||
                    row.Room ||
                    "",

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
    importLocations,
};