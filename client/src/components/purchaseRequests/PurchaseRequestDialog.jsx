import { useEffect, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { createPurchaseRequest, getPurchaseRequestWorkflows } from "../../services/purchaseRequest.service";
import { getDepartments } from "../../services/department.service";
import { getVendors } from "../../services/vendor.service";

const emptyItem = () => ({ itemDescription: "", quantity: 1 });
const initialForm = { departmentId: "", requestedByName: "", justification: "", preferredVendorId: "", estimatedCost: "", workflowId: "", items: [emptyItem()] };

export default function PurchaseRequestDialog({ open, onClose, onSaved }) {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [data, setData] = useState({ departments: [], vendors: [], workflows: [] });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initialForm); setFiles([]); setError("");
    Promise.all([getDepartments(), getVendors(), getPurchaseRequestWorkflows()]).then(([departments, vendors, workflows]) => {
      setData({ departments: departments.data?.data || [], vendors: vendors || [], workflows });
    }).catch(() => setError("Could not load request form options."));
  }, [open]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const changeItem = (index, key, value) => setForm({ ...form, items: form.items.map((item, i) => i === index ? { ...item, [key]: value } : item) });
  const save = async () => {
    if (!form.departmentId || !form.requestedByName || !form.justification || !Number(form.estimatedCost) || form.items.some((item) => !item.itemDescription || Number(item.quantity) < 1)) {
      setError("Complete all required fields and item details."); return;
    }
    try { setSaving(true); await createPurchaseRequest(form, files); onSaved(); onClose(); } catch (err) { setError(err.response?.data?.message || "Could not submit the purchase request."); } finally { setSaving(false); }
  };

  return <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>New Purchase Request</DialogTitle>
    <DialogContent><Grid container spacing={2} sx={{ mt: 0.25 }}>
      {error && <Grid item xs={12}><Alert severity="error">{error}</Alert></Grid>}
      <Grid item xs={12} md={6}><TextField select required fullWidth label="Department" name="departmentId" value={form.departmentId} onChange={change}>{data.departments.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}</TextField></Grid>
      <Grid item xs={12} md={6}><TextField required fullWidth label="Requested by" name="requestedByName" value={form.requestedByName} onChange={change} /></Grid>
      <Grid item xs={12} md={6}><TextField select fullWidth label="Preferred vendor" name="preferredVendorId" value={form.preferredVendorId} onChange={change}><MenuItem value="">No preference</MenuItem>{data.vendors.map((v) => <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>)}</TextField></Grid>
      <Grid item xs={12} md={6}><TextField select fullWidth label="Approval workflow" name="workflowId" value={form.workflowId} onChange={change} helperText="Default: Department Manager > Finance > Admin"><MenuItem value="">Default workflow</MenuItem>{data.workflows.filter((w) => w.isActive).map((w) => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}</TextField></Grid>
      <Grid item xs={12}><TextField required fullWidth type="number" inputProps={{ min: 1 }} label="Estimated cost (INR)" name="estimatedCost" value={form.estimatedCost} onChange={change} /></Grid>
      <Grid item xs={12}><TextField required fullWidth multiline rows={3} label="Justification" name="justification" value={form.justification} onChange={change} /></Grid>
      <Grid item xs={12}><Typography variant="subtitle1" fontWeight={700}>Requested items</Typography>{form.items.map((item, index) => <Box key={index} sx={{ display: "flex", gap: 1, mt: 1 }}><TextField required fullWidth label="Item description" value={item.itemDescription} onChange={(e) => changeItem(index, "itemDescription", e.target.value)} /><TextField required sx={{ width: 125 }} type="number" label="Quantity" inputProps={{ min: 1 }} value={item.quantity} onChange={(e) => changeItem(index, "quantity", e.target.value)} /><IconButton aria-label="Remove item" color="error" disabled={form.items.length === 1} onClick={() => setForm({ ...form, items: form.items.filter((_, i) => i !== index) })}><DeleteIcon /></IconButton></Box>)}<Button sx={{ mt: 1 }} startIcon={<AddIcon />} onClick={() => setForm({ ...form, items: [...form.items, emptyItem()] })}>Add item</Button></Grid>
      <Grid item xs={12}><Button component="label" variant="outlined">Upload vendor quotations (up to 10)<input hidden type="file" accept=".pdf,.png,.jpg,.jpeg" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} /></Button>{files.length > 0 && <Typography variant="body2" sx={{ mt: 1 }}>{files.map((file) => file.name).join(", ")}</Typography>}</Grid>
    </Grid></DialogContent>
    <DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" disabled={saving} onClick={save}>{saving ? "Submitting..." : "Submit Request"}</Button></DialogActions>
  </Dialog>;
}
