const XLSX = require("xlsx");

/**
 * Reads an Excel file and returns JSON data
 * @param {string} filePath
 * @returns {Array}
 */
function readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);

    const firstSheet = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[firstSheet];

    const data = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
        raw: false,
        blankrows: false,
        dateNF: "yyyy-mm-dd",
        trim: true,
    });

    return data;
}

/**
 * Removes completely empty rows
 */
function removeEmptyRows(rows) {
    return rows.filter((row) =>
        Object.values(row).some(
            (value) =>
                value !== "" &&
                value !== null &&
                value !== undefined
        )
    );
}

/**
 * Validate required Excel columns
 */
function validateColumns(rows, requiredColumns) {
    if (!rows.length) {
        throw new Error("Excel file is empty.");
    }

    const excelColumns = Object.keys(rows[0]);

    const missingColumns = requiredColumns.filter(
        (column) => !excelColumns.includes(column)
    );

    if (missingColumns.length) {
        throw new Error(
            `Missing columns: ${missingColumns.join(", ")}`
        );
    }

    return true;
}

/**
 * Read + Validate
 */
function readValidatedExcel(filePath, requiredColumns) {
    let rows = readExcel(filePath);

    rows = removeEmptyRows(rows);

    validateColumns(rows, requiredColumns);

    return rows;
}

module.exports = {
    readExcel,
    removeEmptyRows,
    validateColumns,
    readValidatedExcel,
};