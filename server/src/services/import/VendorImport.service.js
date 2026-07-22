const XLSX = require("xlsx");
const prisma = require("../prisma/client");

async function importVendors(filePath) {
    const workbook = XLSX.readFile(filePath);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet);

    let success = 0;
    let failed = 0;
    const errors = [];

    for (const row of rows) {
        try {

            if (!row.Name) {
                failed++;
                errors.push("Vendor Name missing");
                continue;
            }

            const exists = await prisma.vendor.findFirst({
                where: {
                    name: row.Name
                }
            });

            if (exists) {
                failed++;
                errors.push(`${row.Name} already exists`);
                continue;
            }

            await prisma.vendor.create({
                data: {
                    name: row.Name,
                    contactPerson: row.ContactPerson || null,
                    email: row.Email || null,
                    phone: row.Phone || null,
                    address: row.Address || null,
                    status: row.Status || "ACTIVE"
                }
            });

            success++;

        } catch (err) {

            failed++;
            errors.push(err.message);

        }
    }

    return {
        total: rows.length,
        success,
        failed,
        errors
    };
}

module.exports = {
    importVendors
};