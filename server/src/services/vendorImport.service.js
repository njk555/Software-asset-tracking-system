const XLSX = require("xlsx");
const prisma = require("../prisma/client");

const importVendors = async (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let imported = 0;

    for (const row of rows) {

        const vendorName = row.name || row.Name;

        if (!vendorName) {
            console.log("Skipping row:", row);
            continue;
        }

        const exists = await prisma.vendor.findFirst({
            where: {
                name: vendorName
            }
        });

        if (exists) continue;

        await prisma.vendor.create({
            data: {
                name: vendorName,
                contactPerson:
                    row.contactPerson ||
                    row["Contact Person"] ||
                    "",

                email:
                    row.email ||
                    row.Email ||
                    "",

                phone:
                    String(
                        row.phone ||
                        row.Phone ||
                        ""
                    ),

                status:
                    row.status ||
                    row.Status ||
                    "ACTIVE",
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
    importVendors
};