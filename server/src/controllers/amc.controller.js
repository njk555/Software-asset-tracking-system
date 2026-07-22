const service = require("../services/amc.service");
const reply = (handler, created = false) => async (req, res) => { try { const data = await handler(req); res.status(created ? 201 : 200).json({ success: true, data }); } catch (error) { console.error(error); res.status(400).json({ success: false, message: error.message }); } };
exports.list = reply(() => service.getContracts());
exports.create = reply((req) => service.createContract(req.body), true);
exports.completeService = reply((req) => service.completeService(req.params.id, req.body.serviceDate));
exports.processReminders = reply((req) => service.processReminders(req.body.asOf));
exports.notifications = reply(() => service.getNotifications());
exports.markRead = reply((req) => service.markNotificationRead(req.params.id));
