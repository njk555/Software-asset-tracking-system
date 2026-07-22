import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

export default function VendorDialog({
  open,
  onClose,
  onSave,
  vendor,
}) {
  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (vendor) {
      setForm(vendor);
    } else {
      setForm({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        status: "ACTIVE",
      });
    }
  }, [vendor]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {vendor ? "Edit Vendor" : "Add Vendor"}
      </DialogTitle>

      <DialogContent>
        <TextField
          margin="dense"
          fullWidth
          label="Vendor Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <TextField
          margin="dense"
          fullWidth
          label="Contact Person"
          name="contactPerson"
          value={form.contactPerson}
          onChange={handleChange}
        />

        <TextField
          margin="dense"
          fullWidth
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <TextField
          margin="dense"
          fullWidth
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <TextField
          margin="dense"
          fullWidth
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => onSave(form)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}