const service = require("../services/purchaseRequest.service");

const respond = (handler, successMessage) => async (req, res) => {
  try {
    const data = await handler(req);
    res.status(successMessage ? 201 : 200).json({ success: true, ...(successMessage && { message: successMessage }), data });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = respond(() => service.getPurchaseRequests());
exports.getOne = respond((req) => service.getPurchaseRequest(req.params.id));
exports.getWorkflows = respond(() => service.getWorkflows());
exports.createWorkflow = respond((req) => service.createWorkflow(req.body), "Approval workflow created");
exports.create = respond((req) => {
  const body = { ...req.body, items: JSON.parse(req.body.items || "[]") };
  return service.createPurchaseRequest(body, req.files || []);
}, "Purchase request submitted");
exports.action = respond((req) => service.actOnPurchaseRequest(req.params.id, req.body));
