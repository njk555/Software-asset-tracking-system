/**
 * Standard Import Response
 */
class ImportResponse {
    constructor(total = 0) {
        this.success = true;
        this.total = total;
        this.imported = 0;
        this.skipped = 0;
        this.errors = [];
        this.warnings = [];
        this.startedAt = new Date();
        this.completedAt = null;
    }

    importedRow() {
        this.imported++;
    }

    skippedRow(reason) {
        this.skipped++;

        if (reason) {
            this.errors.push(reason);
        }
    }

    warning(message) {
        this.warnings.push(message);
    }

    finish() {
        this.completedAt = new Date();

        return {
            success: this.errors.length === 0,
            total: this.total,
            imported: this.imported,
            skipped: this.skipped,
            errors: this.errors,
            warnings: this.warnings,
            startedAt: this.startedAt,
            completedAt: this.completedAt,
            duration:
                (this.completedAt - this.startedAt) / 1000 + " sec",
        };
    }
}

module.exports = ImportResponse;