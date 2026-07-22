const XLSX = require("xlsx");
const prisma = require("../prisma/client");

const importCategories = async (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let imported = 0;

    for (const row of rows) {

        const categoryName = row.name || row.Name;

        if (!categoryName) continue;

        const exists = await prisma.assetCategory.findFirst({
            where: {
                name: categoryName
            }
        });

        if (exists) continue;

        await prisma.assetCategory.create({
            data: {
                name: categoryName,
                description:
                    row.description ||
                    row.Description ||
                    "",
                status:
                    row.status ||
                    row.Status ||
                    "ACTIVE"
            }
        });

        imported++;
    }

    return {
        success: true,
        imported
    };
};

module.exports = {
    importCategories
};