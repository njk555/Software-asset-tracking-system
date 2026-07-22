import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";

const initialState = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  status: "ACTIVE",
};

export default function VendorDialog({
  open,
  handleClose,
  handleSave,
  vendor,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (vendor) {
      setForm(vendor);
    } else {
      setForm(initialState);
    }
  }, [vendor]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = () => {
    handleSave(form);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {vendor ? "Edit Vendor" : "Add Vendor"}
      </DialogTitle>

      <DialogContent>

        <Grid container spacing={2} mt={1}>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Vendor Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact Person"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            </TextField>
          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onSubmit}
        >
          {vendor ? "Update Vendor" : "Save Vendor"}
        </Button>

      </DialogActions>
    </Dialog>
  );
}