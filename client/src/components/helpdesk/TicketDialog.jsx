import { useState, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import { getDepartments } from "../../services/department.service";

import {
  createTicket,
  updateTicket,
} from "../../services/ticket.service";

const priorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const categories = [
  "Hardware",
  "Software",
  "Network",
  "Printer",
  "Email",
  "Internet",
  "Other",
];

export default function TicketDialog({
  open,
  onClose,
  onSuccess,
  ticket,
}) {

  const initialForm = {
    title: "",
    description: "",
    priority: "Medium",
    category: "Hardware",
    departmentId: "",
    attachment: null,
  };

  const [form, setForm] = useState(initialForm);

  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {

    if (!open) return;

    loadDepartments();

  }, [open]);

  useEffect(() => {

    if (!open) return;

    if (ticket) {

      setForm({

        title: ticket.title || "",

        description: ticket.description || "",

        priority: ticket.priority || "Medium",

        category: ticket.category || "Hardware",

        departmentId:
          ticket.departmentId ||
          ticket.department?.id ||
          "",

        attachment: null,

      });

    } else {

      setForm(initialForm);

    }

  }, [ticket, open]);

  const loadDepartments = async () => {
  try {
    const res = await getDepartments();

    console.log("Departments:", res.data);

    const departmentData = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
      ? res.data
      : [];

    setDepartments(departmentData);

  } catch (err) {
    console.error(err);

    setDepartments([]);

    setSnackbar({
      open: true,
      severity: "error",
      message: "Unable to load departments",
    });
  }
};

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleFile = (e) => {

    setForm((prev) => ({
      ...prev,
      attachment: e.target.files[0],
    }));

  };
    const validate = () => {

    if (!form.title.trim()) {
      setSnackbar({
        open: true,
        severity: "warning",
        message: "Ticket title is required",
      });
      return false;
    }

    if (!form.description.trim()) {
      setSnackbar({
        open: true,
        severity: "warning",
        message: "Description is required",
      });
      return false;
    }

    if (!form.departmentId) {
      setSnackbar({
        open: true,
        severity: "warning",
        message: "Please select a department",
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const handleSubmit = async () => {

    if (!validate()) return;

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("priority", form.priority);
      formData.append("category", form.category);
      formData.append("departmentId", form.departmentId);

      if (form.attachment) {
        formData.append("attachment", form.attachment);
      }

      if (ticket?.id) {

        await updateTicket(ticket.id, formData);

        setSnackbar({
          open: true,
          severity: "success",
          message: "Ticket updated successfully",
        });

      } else {

        await createTicket(formData);

        setSnackbar({
          open: true,
          severity: "success",
          message: "Ticket created successfully",
        });

      }

      resetForm();

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 500);

    } catch (error) {

      console.error(error);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Failed to save ticket",
      });

    } finally {

      setLoading(false);

    }

  };

  const handleDialogClose = () => {

    if (loading) return;

    resetForm();

    onClose();

  };
    return (
    <>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {ticket ? "Edit Helpdesk Ticket" : "Raise Helpdesk Ticket"}
        </DialogTitle>

        <DialogContent dividers>

          <Grid container spacing={2} sx={{ mt: 0.5 }}>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Ticket Title"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={5}
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>

                <InputLabel>
                  Priority
                </InputLabel>

                <Select
                  name="priority"
                  label="Priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  {priorities.map((priority) => (
                    <MenuItem
                      key={priority}
                      value={priority}
                    >
                      {priority}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>

                <InputLabel>
                  Category
                </InputLabel>

                <Select
                  name="category"
                  label="Category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem
                      key={category}
                      value={category}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>
            </Grid>

            <Grid item xs={12}>

              <FormControl fullWidth>

                <InputLabel>
                  Department
                </InputLabel>

                <Select
                  name="departmentId"
                  label="Department"
                  value={form.departmentId}
                  onChange={handleChange}
                >
                  {departments.map((department) => (
                    <MenuItem
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>

            </Grid>

            <Grid item xs={12}>

              <Typography
                variant="subtitle2"
                sx={{ mb: 1 }}
              >
                Attachment
              </Typography>

              <input
                type="file"
                onChange={handleFile}
              />

              {form.attachment && (
                <Typography
                  variant="body2"
                  sx={{ mt: 1 }}
                  color="text.secondary"
                >
                  Selected File: {form.attachment.name}
                </Typography>
              )}

            </Grid>

          </Grid>

        </DialogContent>

        <DialogActions>

          <Button
            color="inherit"
            disabled={loading}
            onClick={handleDialogClose}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={20}
                  sx={{ mr: 1 }}
                />

                {ticket
                  ? "Updating..."
                  : "Creating..."}
              </>
            ) : ticket ? (
              "Update Ticket"
            ) : (
              "Raise Ticket"
            )}

          </Button>

        </DialogActions>

      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </>
  );
}