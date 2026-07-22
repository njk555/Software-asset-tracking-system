import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

const initialForm = {
  assetCode: "",
  assetName: "",
  serialNumber: "",
  model: "",
  manufacturer: "",
  purchaseDate: "",
  status: "AVAILABLE",
  vendorId: "",
  categoryId: "",
  locationId: "",
};

export default function AssetDialog({
  open,
  onClose,
  onSave,
  vendors = [],
  categories = [],
  locations = [],
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (open) {
      setForm(initialForm);
    }
  }, [open]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Add New Asset</DialogTitle>

      <DialogContent>

        <Grid container spacing={2} sx={{ mt: 1 }}>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Asset Code"
              name="assetCode"
              value={form.assetCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Asset Name"
              name="assetName"
              value={form.assetName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Serial Number"
              name="serialNumber"
              value={form.serialNumber}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Model"
              name="model"
              value={form.model}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Manufacturer"
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Purchase Date"
              name="purchaseDate"
              value={form.purchaseDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="ASSIGNED">Assigned</MenuItem>
              <MenuItem value="REPAIR">Repair</MenuItem>
              <MenuItem value="DISPOSED">Disposed</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Vendor"
              name="vendorId"
              value={form.vendorId}
              onChange={handleChange}
            >
              {vendors.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Category"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Location"
              name="locationId"
              value={form.locationId}
              onChange={handleChange}
            >
              {locations.map((l) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Save Asset
        </Button>

      </DialogActions>

    </Dialog>
  );
}