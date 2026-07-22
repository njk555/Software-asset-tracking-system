const PDFDocument = require("pdfkit");
const path = require("path");
const { toWords } = require("number-to-words");

const COMPANY = {
    name: process.env.COMPANY_NAME || "TWAC LLP",
    tagline: process.env.COMPANY_TAGLINE || "TECH WORLD AT CLICK",
    address: process.env.COMPANY_ADDRESS || "LHS JLN Strt 66, JLN Stadium Metro Station, Kaloor, Kochi, Kerala - 682017",
    phone: process.env.COMPANY_PHONE || "+91 95626 99398",
    whatsapp: process.env.COMPANY_WHATSAPP || "+91 95626 99398",
    email: process.env.COMPANY_EMAIL || "info@twac.in",
    logo: path.join(__dirname, "..", "assets", "twac-logo.png")
};

const formatDate = (value) => value
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
    }).format(new Date(value)).toUpperCase()
    : "-";

const formatAmount = (value) => Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const moneyInWords = (amount) => {
    const rounded = Math.round(Number(amount || 0));
    return `INR ${toWords(rounded).replace(/\b\w/g, letter => letter.toUpperCase())} Only`;
};

function drawFooter(doc, pageNumber) {
    const y = 728;
    doc.strokeColor("#0d647c").lineWidth(0.7).moveTo(45, y - 9).lineTo(550, y - 9).stroke();
    doc.fillColor("#163b4d").font("Helvetica-Bold").fontSize(7.8)
        .text(COMPANY.name, 45, y, { width: 400 });
    doc.fillColor("#46576a").font("Helvetica").fontSize(7.2)
        .text(`Registered Office: ${COMPANY.address}`, 45, y + 11, { width: 455 })
        .text(`Mobile: ${COMPANY.phone}  |  WhatsApp: ${COMPANY.whatsapp}  |  Email: ${COMPANY.email}`, 45, y + 22, { width: 455 });
    doc.text(`Page ${pageNumber}`, 485, y + 22, { width: 65, align: "right" });
}

function addTermsHeader(doc, poNumber) {
    doc.image(COMPANY.logo, 45, 36, { fit: [118, 42] });
    doc.fillColor("#163b4d").font("Helvetica-Bold").fontSize(15)
        .text("TERMS AND CONDITIONS", 260, 42, { width: 290, align: "right" });
    doc.fillColor("#577080").font("Helvetica").fontSize(8.5)
        .text(`Purchase Order: ${poNumber}`, 260, 64, { width: 290, align: "right" });
    doc.strokeColor("#0d647c").lineWidth(1.25).moveTo(45, 92).lineTo(550, 92).stroke();
    doc.x = 45;
    doc.y = 114;
}

function addTermsTableHeader(doc) {
    doc.fillColor("#0d647c").rect(45, 114, 505, 23).fill();
    doc.fillColor("white").font("Helvetica-Bold").fontSize(8.5)
        .text("TERM", 52, 121)
        .text("CONDITION", 207, 121);
    doc.x = 45;
    doc.y = 137;
}

function addTermsAndConditions(doc, poNumber) {
    const terms = [
        ["General Terms", `The materials and services specified in this purchase order (PO) are supplied subject to these terms and the instructions, specifications, quantities, and delivery dates stated in the PO. The vendor or service provider is the party named on the face of this PO.`],
        ["Price", "The PO value is exclusive of applicable taxes unless the PO expressly states otherwise. Any additional charges require written approval before they are incurred."],
        ["Acceptance of Purchase Order", "The vendor must acknowledge acceptance of this PO, including all terms and the delivery schedule, within 24 hours of issue. If no acknowledgement is received within that period, the PO will be treated as accepted."],
        ["Inspection", `${COMPANY.name} may inspect and test the materials or services. Non-conforming, defective, or damaged items may be rejected. The vendor must promptly replace or correct rejected items at its own expense.`],
        ["Payment", `Payment will be made after receipt and acceptance of the ordered materials or services and receipt of a valid invoice with the required supporting documents. Statutory deductions, including TDS or other applicable taxes, may apply.`],
        ["Delivery", "Time is of the essence. Delivery must be made by the date stated in the PO. The buyer may postpone delivery for a reasonable period or suspend delivery because of events outside its reasonable control."],
        ["Specifications", "All materials and services must comply with the specifications approved or prescribed in this PO. Any deviation must be approved in writing before delivery or performance."],
        ["Order Completion", "The order is not considered complete until every requested material or service has been delivered or performed in accordance with the specified quantity, quality, and requirements."],
        ["Confidential Information", "The vendor must protect all confidential information received in connection with this PO and must not disclose it except where required for performance or by law. The vendor is responsible for its personnel and subcontractors."],
        ["Indemnity", `The vendor will indemnify and defend ${COMPANY.name}, its directors, employees, and affiliates against losses, claims, liabilities, damages, and costs arising from the vendor's breach, negligence, infringement, or failure to perform this PO.`],
        ["Limitation of Liability", `${COMPANY.name} will not be liable for indirect, consequential, special, punitive, incidental, or exemplary damages, including loss of use, data, revenue, profit, or business opportunity.`],
        ["Intellectual Property", "The vendor warrants that the materials and services supplied do not infringe any third-party intellectual property rights. The vendor will defend, indemnify, and hold the buyer harmless against related claims."],
        ["Compliance with Laws", "The vendor must comply with all applicable central, state, local, and regulatory laws, rules, orders, and standards while performing this PO."],
        ["Warranty", "The vendor warrants that all materials and services will conform to the PO, be free from defects, and be fit for their intended purpose. The vendor will promptly remedy any defect during the applicable warranty period."],
        ["Delivery and Performance", "If the vendor fails to deliver or perform on time, the buyer may use its available remedies, including obtaining replacement materials or services from another supplier and recovering the resulting reasonable costs from the vendor."],
        ["Cancellation or Termination", `${COMPANY.name} may cancel or terminate this PO, in whole or in part, for material breach, repeated poor performance, failure to meet the delivery schedule, or other reasonable business grounds. Termination does not waive rights accrued before termination.`],
        ["Assignment and Amendment", "The vendor may not assign or transfer this PO without prior written approval. Any amendment to this PO is valid only when made in writing and authorized by the buyer."],
        ["No Publicity", "The vendor must not use the buyer's name, logo, or relationship with the buyer in advertising, publicity, or promotional material without prior written consent."],
        ["Set-off and Survival", "The buyer may set off amounts owed by the vendor against amounts payable under this PO. Clauses relating to confidentiality, indemnity, warranty, liability, and rights that by their nature survive will remain effective after completion or termination."],
        ["Governing Law and Disputes", "This PO is governed by the laws of India. Any dispute will first be addressed in good faith by the parties; unresolved disputes will be subject to the competent courts of the buyer's registered jurisdiction."]
    ];

    const startPage = () => {
        doc.addPage();
        addTermsHeader(doc, poNumber);
        addTermsTableHeader(doc);
    };
    startPage();

    terms.forEach(([heading, body], index) => {
        doc.font("Helvetica-Bold").fontSize(8.5);
        const headingHeight = doc.heightOfString(heading, { width: 140 });
        doc.font("Helvetica").fontSize(8.3);
        const bodyHeight = doc.heightOfString(body, { width: 336, lineGap: 2 });
        const rowHeight = Math.max(headingHeight, bodyHeight) + 14;

        // Keep a generous bottom margin so a wrapped row never triggers an
        // automatic PDFKit page break without the repeated table header.
        if (doc.y > 570 || doc.y + rowHeight > 620) startPage();

        const rowY = doc.y;
        doc.fillColor(index % 2 ? "#f7fafb" : "#ffffff").rect(45, rowY, 505, rowHeight).fill();
        doc.strokeColor("#b6c6cc").lineWidth(0.4).rect(45, rowY, 505, rowHeight).stroke();
        doc.moveTo(200, rowY).lineTo(200, rowY + rowHeight).stroke();
        doc.fillColor("#163b4d").font("Helvetica-Bold").fontSize(8.5)
            .text(heading, 52, rowY + 7, { width: 140, lineGap: 1.5 });
        doc.fillColor("#46576a").font("Helvetica").fontSize(8.3)
            .text(body, 207, rowY + 7, { width: 336, lineGap: 2 });
        doc.x = 45;
        doc.y = rowY + rowHeight;
    });
}

function buildPurchaseOrderPdf(po) {
    const doc = new PDFDocument({ size: "A4", margin: 45, bufferPages: true });
    const pageWidth = 595.28;
    const contentWidth = pageWidth - 90;
    const left = 45;

    doc.image(COMPANY.logo, left, 42, { fit: [145, 50] });
    doc.fillColor("#163b4d").font("Helvetica-Bold").fontSize(18)
        .text("PURCHASE ORDER", 320, 48, { width: 230, align: "right" });
    doc.fillColor("#577080").font("Helvetica").fontSize(8.5)
        .text(COMPANY.name, 320, 73, { width: 230, align: "right" })
        .text(COMPANY.tagline, 320, 86, { width: 230, align: "right" });
    doc.strokeColor("#0d647c").lineWidth(1.5).moveTo(left, 108).lineTo(left + contentWidth, 108).stroke();

    doc.fillColor("#163b4d").font("Helvetica-Bold").fontSize(9).text("TO", left, 126);
    doc.fillColor("#1d2a33").font("Helvetica-Bold").fontSize(11)
        .text(po.vendor?.name || "Vendor", left, 142, { width: 275 });
    const vendorDetails = [po.vendor?.address, po.vendor?.contactPerson && `Kind attention: ${po.vendor.contactPerson}`, po.vendor?.email, po.vendor?.phone]
        .filter(Boolean).join("\n") || "Vendor address not provided";
    doc.font("Helvetica").fontSize(9).fillColor("#4e5d66").text(vendorDetails, left, 159, { width: 275, lineGap: 2 });

    const detailsX = 360;
    const details = [
        ["Purchase Order", po.poNumber],
        ["Date", formatDate(po.orderDate)],
        ["Expected delivery", formatDate(po.expectedDelivery)],
        ["Status", po.status]
    ];
    details.forEach(([label, value], index) => {
        const y = 126 + index * 22;
        doc.fillColor("#577080").font("Helvetica-Bold").fontSize(8).text(label.toUpperCase(), detailsX, y);
        doc.fillColor("#1d2a33").font("Helvetica").fontSize(9.5).text(value || "-", detailsX, y + 9, { width: 190, align: "right" });
    });

    const tableY = 250;
    const cols = [left, 77, 305, 365, 423, 495, 550];
    doc.fillColor("#0d647c").rect(left, tableY, contentWidth, 27).fill();
    doc.fillColor("white").font("Helvetica-Bold").fontSize(8)
        .text("SR.", cols[0] + 5, tableY + 9)
        .text("DESCRIPTION", cols[1] + 5, tableY + 9)
        .text("CATEGORY", cols[2] + 5, tableY + 9)
        .text("QTY", cols[3] + 5, tableY + 9)
        .text("UNIT PRICE (INR)", cols[4] + 3, tableY + 9)
        .text("AMOUNT (INR)", cols[5] + 2, tableY + 9);

    let y = tableY + 27;
    const items = po.items || [];
    items.forEach((item, index) => {
        const rowHeight = 32;
        doc.fillColor(index % 2 ? "#f2f7f8" : "#ffffff").rect(left, y, contentWidth, rowHeight).fill();
        doc.strokeColor("#b6c6cc").lineWidth(0.4).rect(left, y, contentWidth, rowHeight).stroke();
        cols.slice(1, -1).forEach(x => doc.moveTo(x, y).lineTo(x, y + rowHeight).stroke());
        doc.fillColor("#1d2a33").font("Helvetica").fontSize(8.5)
            .text(String(index + 1), cols[0] + 10, y + 11, { width: 16, align: "center" })
            .text(item.assetName || "-", cols[1] + 5, y + 7, { width: 220, height: 20 })
            .text(item.category?.name || "-", cols[2] + 5, y + 7, { width: 54, height: 20 })
            .text(String(item.quantity || 0), cols[3] + 5, y + 11, { width: 48, align: "right" })
            .text(formatAmount(item.unitPrice), cols[4] + 3, y + 11, { width: 67, align: "right" })
            .text(formatAmount(item.totalPrice), cols[5] + 2, y + 11, { width: 50, align: "right" });
        y += rowHeight;
    });

    const totalsY = Math.max(y + 18, 410);
    doc.fillColor("#163b4d").font("Helvetica-Bold").fontSize(9).text("Amount in words", left, totalsY);
    doc.fillColor("#46576a").font("Helvetica").fontSize(9).text(moneyInWords(po.totalAmount), left, totalsY + 15, { width: 285 });
    doc.fillColor("#f2f7f8").rect(350, totalsY - 5, 200, 54).fill();
    doc.fillColor("#163b4d").font("Helvetica-Bold").fontSize(10).text("NET TOTAL", 362, totalsY + 7);
    doc.fontSize(12).text(`INR ${formatAmount(po.totalAmount)}`, 362, totalsY + 25, { width: 175, align: "right" });

    const notesY = totalsY + 86;
    doc.fillColor("#163b4d").font("Helvetica-Bold").fontSize(9).text("Remarks / Terms", left, notesY);
    doc.fillColor("#46576a").font("Helvetica").fontSize(8.5)
        .text(po.remarks || "Please quote the purchase order number on all invoices and correspondence.", left, notesY + 15, { width: contentWidth, lineGap: 2 });
    doc.fillColor("#46576a").fontSize(8).text("This is a computer-generated purchase order and does not require a physical signature.", left, 700, { width: contentWidth, align: "center" });

    addTermsAndConditions(doc, po.poNumber);

    const pages = doc.bufferedPageRange();
    for (let index = 0; index < pages.count; index += 1) {
        doc.switchToPage(index);
        drawFooter(doc, index + 1);
    }
    return doc;
}

module.exports = { buildPurchaseOrderPdf };
