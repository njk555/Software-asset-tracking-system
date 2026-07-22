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
  description: "",
  manager: "",
};

export default function DepartmentDialog({
  open,
  onClose,
  onSave,
  department,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (department)
      setForm(department);
    else
      setForm(initialState);
  }, [department]);

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
        {department ? "Edit Department" : "Add Department"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Department Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Manager"
              name="manager"
              value={form.manager}
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