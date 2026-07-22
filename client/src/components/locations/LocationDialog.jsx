import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@mui/material";

const initialState = {
  name: "",
  building: "",
  floor: "",
  room: "",
};

export default function LocationDialog({
  open,
  onClose,
  onSave,
  location,
}) {

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (location)
      setForm(location);
    else
      setForm(initialState);
  }, [location]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {location ? "Edit Location" : "Add Location"}
      </DialogTitle>

      <DialogContent>

        <Grid container spacing={2} sx={{ mt: 1 }}>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Building"
              name="building"
              value={form.building}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Floor"
              name="floor"
              value={form.floor}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Room"
              name="room"
              value={form.room}
              onChange={handleChange}
            />
          </Grid>

        </Grid>

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