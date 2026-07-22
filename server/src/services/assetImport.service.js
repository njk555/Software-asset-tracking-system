const XLSX = require("xlsx");
const fs = require("fs");
const prisma = require("../prisma/client");
console.log("NEW IMPORT SERVICE LOADED");

exports.importExcel = async (filePath) => {

    const workbook = XLSX.readFile(filePath);

    const sheet =
        workbook.Sheets[
            workbook.SheetNames[0]
        ];

    const rows =
        XLSX.utils.sheet_to_json(sheet);

    let imported = 0;
    let skipped = 0;

    const errors = [];

    for (let index = 0; index < rows.length; index++) {

        const row = rows[index];

        try {

            // ----------------------------
            // Required Fields
            // ----------------------------

            if (
                !row.assetCode ||
                !row.assetName ||
                !row.serialNumber
            ) {

                skipped++;

                errors.push(
                    `Row ${index + 2} : Missing required fields`
                );

                continue;
            }

            // ----------------------------
            // Duplicate Asset Code
            // ----------------------------

            const existingCode =
                await prisma.asset.findUnique({

                    where: {
                        assetCode: row.assetCode
                    }

                });

            if (existingCode) {

                skipped++;

                errors.push(
                    `Row ${index + 2} : Asset Code ${row.assetCode} already exists`
                );

                continue;
            }

            // ----------------------------
            // Duplicate Serial Number
            // ----------------------------

            const existingSerial =
                await prisma.asset.findUnique({

                    where: {
                        serialNumber: row.serialNumber
                    }

                });

            if (existingSerial) {

                skipped++;

                errors.push(
                    `Row ${index + 2} : Serial Number already exists`
                );

                continue;
            }

            // ----------------------------
            // Vendor Lookup
            // ----------------------------

            const vendor =
                await prisma.vendor.findFirst({

                    where: {
                        name: row.vendor
                    }

                });

            if (!vendor) {

                skipped++;

                errors.push(
                    `Row ${index + 2} : Vendor '${row.vendor}' not found`
                );

                continue;
            }

            // ----------------------------
            // Category Lookup
            // ----------------------------

            const category =
                await prisma.assetCategory.findFirst({

                    where: {
                        name: row.category
                    }

                });

            if (!category) {

                skipped++;

                errors.push(
                    `Row ${index + 2} : Category '${row.category}' not found`
                );

                continue;
            }

            // ----------------------------
            // Location Lookup
            // ----------------------------

            const location =
                await prisma.location.findFirst({

                    where: {
                        name: row.location
                    }

                });

            if (!location) {

                skipped++;

                errors.push(
                    `Row ${index + 2} : Location '${row.location}' not found`
                );

                continue;
            }

            // ----------------------------
            // Insert Asset
            // ----------------------------

            await prisma.asset.create({

                data: {

                    assetCode: row.assetCode,

                    assetName: row.assetName,

                    serialNumber: row.serialNumber,

                    manufacturer:
                        row.manufacturer || "",

                    model:
                        row.model || "",

                    purchaseDate:
                        row.purchaseDate
                            ? new Date(row.purchaseDate)
                            : null,

                    purchaseCost:
                        Number(
                            row.purchaseCost || 0
                        ),

                    warrantyExpiry:
                        row.warrantyExpiry
                            ? new Date(row.warrantyExpiry)
                            : null,

                    condition:
                        row.condition || "GOOD",

                    status:
                        row.status || "AVAILABLE",

                    vendorId:
                        vendor.id,

                    categoryId:
                        category.id,

                    locationId:
                        location.id,

                }

            });

            imported++;

        }

        catch (err) {

            skipped++;

            errors.push(
                `Row ${index + 2} : ${err.message}`
            );

        }

    }

    // Delete uploaded file

    if (fs.existsSync(filePath)) {

        fs.unlinkSync(filePath);

    }

    return {

        imported,

        skipped,

        total: rows.length,

        errors,

    };

};