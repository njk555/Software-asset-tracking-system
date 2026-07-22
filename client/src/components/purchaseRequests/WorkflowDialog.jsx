import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { createPurchaseRequestWorkflow } from "../../services/purchaseRequest.service";

export default function WorkflowDialog({ open, onClose, onSaved }) {
  const [name, setName] = useState(""); const [steps, setSteps] = useState("Department Manager, Finance, Admin"); const [error, setError] = useState("");
  const save = async () => { try { await createPurchaseRequestWorkflow({ name, approvalSteps: steps.split(",").map((step) => step.trim()).filter(Boolean) }); setName(""); onSaved(); onClose(); } catch (err) { setError(err.response?.data?.message || "Could not save workflow."); } };
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"><DialogTitle>Configure Approval Workflow</DialogTitle><DialogContent><TextField autoFocus required fullWidth sx={{ mt: 1, mb: 2 }} label="Workflow name" value={name} onChange={(e) => setName(e.target.value)} /><TextField required fullWidth helperText="Enter approval roles in the order they should approve." label="Approval roles (comma separated)" value={steps} onChange={(e) => setSteps(e.target.value)} />{error && <p style={{ color: "#d32f2f" }}>{error}</p>}</DialogContent><DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" onClick={save}>Save workflow</Button></DialogActions></Dialog>;
}
