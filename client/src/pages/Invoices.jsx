import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import InvoiceDialog from "../components/invoices/InvoiceDialog";
import { getInvoiceReminders, getInvoices, markInvoicePaid } from "../services/invoice.service";

const colors = { PENDING: "warning", PAID: "success", OVERDUE: "error" };

export default function Invoices() {
  const [invoices, setInvoices] = useState([]); const [reminders, setReminders] = useState([]); const [open, setOpen] = useState(false); const [error, setError] = useState("");
  const load = async () => { try { const [invoiceData, reminderData] = await Promise.all([getInvoices(), getInvoiceReminders()]); setInvoices(invoiceData); setReminders(reminderData); setError(""); } catch { setError("Unable to load invoices."); } };
  useEffect(() => { load(); }, []);
  const paid = async (id) => { try { await markInvoicePaid(id); load(); } catch (err) { setError(err.response?.data?.message || "Could not mark invoice as paid."); } };
  return <Box p={4}><Typography variant="h4" fontWeight={700} mb={1}>Invoice Management</Typography><Typography color="text.secondary" mb={3}>Upload invoices, calculate tax and due dates automatically, and track payment reminders.</Typography>{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {reminders.length > 0 && <Alert icon={<NotificationsActiveIcon />} severity={reminders.some((r) => r.type === "OVERDUE") ? "error" : "warning"} sx={{ mb: 3 }}><b>{reminders.length} payment reminder(s)</b><br />{reminders.map((reminder) => `${reminder.type === "OVERDUE" ? "Overdue" : "Due soon"}: ${reminder.invoice.invoiceNumber} (${reminder.invoice.vendor.name}) - ${reminder.recipient}`).join(" | ")}</Alert>}
    <Paper sx={{ p: 2, mb: 3, display: "flex", justifyContent: "flex-end" }}><Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Upload Invoice</Button></Paper>
    <TableContainer component={Paper}><Table><TableHead><TableRow><TableCell>Invoice</TableCell><TableCell>Vendor / Department</TableCell><TableCell>Payment terms</TableCell><TableCell>Tax</TableCell><TableCell>Total</TableCell><TableCell>Due date</TableCell><TableCell>Status</TableCell><TableCell /></TableRow></TableHead><TableBody>{invoices.map((invoice) => <TableRow key={invoice.id}><TableCell><b>{invoice.invoiceNumber}</b><br /><Typography variant="caption">{new Date(invoice.invoiceDate).toLocaleDateString()}</Typography></TableCell><TableCell>{invoice.vendor.name}<br /><Typography variant="caption">{invoice.department?.name || "Finance"}</Typography></TableCell><TableCell>{invoice.paymentTerm.replaceAll("_", " ")}</TableCell><TableCell>{invoice.taxType.replaceAll("_", " ")}<br /><Typography variant="caption">INR {Number(invoice.taxAmount).toLocaleString()}</Typography></TableCell><TableCell>INR {Number(invoice.totalAmount).toLocaleString()}</TableCell><TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell><TableCell><Chip size="small" label={invoice.status} color={colors[invoice.status]} /></TableCell><TableCell>{invoice.status !== "PAID" && <Button size="small" onClick={() => paid(invoice.id)}>Mark paid</Button>}</TableCell></TableRow>)}{!invoices.length && <TableRow><TableCell colSpan={8} align="center">No invoices uploaded yet.</TableCell></TableRow>}</TableBody></Table></TableContainer><InvoiceDialog open={open} onClose={() => setOpen(false)} onSaved={load} /></Box>;
}
