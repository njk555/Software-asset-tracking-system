const service = require("../services/invoice.service");

exports.list = async (_, res) => { try { res.json({ success: true, data: await service.listInvoices() }); } catch (error) { res.status(500).json({ success: false, message: error.message }); } };
exports.create = async (req, res) => { try { res.status(201).json({ success: true, message: "Invoice uploaded successfully", data: await service.createInvoice(req.body, req.file) }); } catch (error) { res.status(400).json({ success: false, message: error.message }); } };
exports.markPaid = async (req, res) => { try { res.json({ success: true, data: await service.markPaid(req.params.id) }); } catch (error) { res.status(400).json({ success: false, message: error.message }); } };
exports.reminders = async (req, res) => { try { res.json({ success: true, data: await service.getDueReminders(req.query.daysAhead || 7) }); } catch (error) { res.status(500).json({ success: false, message: error.message }); } };
exports.taxRules = (_, res) => res.json({ success: true, data: { taxRates: service.TAX_RATES, paymentTermDays: service.PAYMENT_TERM_DAYS } });
