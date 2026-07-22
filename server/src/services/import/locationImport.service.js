const prisma = require("../../prisma/client");
const {
    readValidatedExcel,
} = require("../../utils/excelReader");
const ImportResponse = require("../../utils/importResponse");

const REQUIRED_COLUMNS = [
    "name",
    "building",
    "floor",
    "room",
];

async function importLocations(filePath) {

    const rows = readValidatedExcel(
        filePath,
        REQUIRED_COLUMNS
    );

    const result = new ImportResponse(rows.length);

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];

        try {

            const exists = await prisma.location.findFirst({
                where: {
                    name: row.name.trim(),
                },
            });

            if (exists) {

                result.skippedRow(
                    `Row ${i + 2}: Location already exists`
                );

                continue;
            }

            await prisma.location.create({

                data: {

                    name: row.name.trim(),

                    building: row.building || null,

                    floor: row.floor || null,

                    room: row.room || null,
                },
            });

            result.importedRow();

        } catch (err) {

            result.skippedRow(
                `Row ${i + 2}: ${err.message}`
            );

        }

    }

    return result.finish();

}

module.exports = {

    importLocations,

};