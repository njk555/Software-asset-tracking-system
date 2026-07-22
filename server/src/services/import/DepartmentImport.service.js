const prisma = require("../../prisma/client");
const {
    readValidatedExcel,
} = require("../../utils/excelReader");
const ImportResponse = require("../../utils/importResponse");

const REQUIRED_COLUMNS = [
    "name",
    "description",
];

async function importDepartments(filePath) {

    const rows = readValidatedExcel(filePath, REQUIRED_COLUMNS);

    const result = new ImportResponse(rows.length);

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];

        try {

            const exists = await prisma.department.findFirst({
                where: {
                    name: row.name.trim(),
                },
            });

            if (exists) {
                result.skippedRow(
                    `Row ${i + 2}: Department already exists`
                );
                continue;
            }

            await prisma.department.create({
                data: {
                    name: row.name.trim(),
                    description: row.description || null,
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
    importDepartments,
};