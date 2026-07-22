import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  LinearProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

import CategoryDialog from "../components/categories/CategoryDialog";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service";

import { importCategories } from "../services/CategoryImport.service";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadCategories = async () => {
    try {
      const res = await getCategories();

      const data = res.data.data || [];

      setCategories(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const value = search.toLowerCase();

    setFiltered(
      categories.filter(
        (category) =>
          category.name.toLowerCase().includes(value) ||
          (category.description || "")
            .toLowerCase()
            .includes(value)
      )
    );
  }, [search, categories]);

  const handleSave = async (data) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, data);

        setSnackbar({
          open: true,
          severity: "success",
          message: "Category updated successfully",
        });
      } else {
        await createCategory(data);

        setSnackbar({
          open: true,
          severity: "success",
          message: "Category added successfully",
        });
      }

      setDialogOpen(false);
      setSelectedCategory(null);

      loadCategories();
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          err.response?.data?.message ||
          "Operation Failed",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?"))
      return;

    try {
      await deleteCategory(id);

      setSnackbar({
        open: true,
        severity: "success",
        message: "Category deleted successfully",
      });

      loadCategories();
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Delete Failed",
      });
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      await importCategories(
        file,
        (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) /
              progressEvent.total
          );

          setUploadProgress(percent);
        }
      );

      setSnackbar({
        open: true,
        severity: "success",
        message:
          "Categories Imported Successfully",
      });

      loadCategories();
    } catch (err) {
      console.error(err);

      setSnackbar({
        open: true,
        severity: "error",
        message: "Import Failed",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box p={4}>
  <Typography
    variant="h4"
    fontWeight="bold"
    mb={3}
  >
    Categories
  </Typography>

  <Paper
    sx={{
      p: 3,
      mb: 3,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <TextField
      placeholder="Search Categories..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      sx={{ width: 350 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />

    <Box
      display="flex"
      gap={2}
    >
      <Button
        variant="outlined"
        component="label"
      >
        IMPORT EXCEL

        <input
          hidden
          type="file"
          accept=".xlsx,.xls"
          onChange={handleImport}
        />
      </Button>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => {
          setSelectedCategory(null);
          setDialogOpen(true);
        }}
      >
        ADD CATEGORY
      </Button>
    </Box>
  </Paper>

  {uploading && (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="body2"
        mb={1}
      >
        Uploading...
        {uploadProgress}%
      </Typography>

      <LinearProgress
        variant="determinate"
        value={uploadProgress}
      />
    </Box>
  )}

  <TableContainer
    component={Paper}
  >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <b>Name</b>
          </TableCell>

          <TableCell>
            <b>Description</b>
          </TableCell>

          <TableCell>
            <b>Status</b>
          </TableCell>

          <TableCell align="center">
            <b>Actions</b>
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>

        {filtered.map((category) => (

          <TableRow key={category.id}>

            <TableCell>
              {category.name}
            </TableCell>

            <TableCell>
              {category.description}
            </TableCell>

            <TableCell>
              <Chip
                label={category.status}
                color={
                  category.status ===
                  "ACTIVE"
                    ? "success"
                    : "default"
                }
              />
            </TableCell>

            <TableCell align="center">

              <IconButton
                color="primary"
                onClick={() => {
                  setSelectedCategory(
                    category
                  );
                  setDialogOpen(true);
                }}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                color="error"
                onClick={() =>
                  handleDelete(
                    category.id
                  )
                }
              >
                <DeleteIcon />
              </IconButton>

            </TableCell>

          </TableRow>

        ))}

        {filtered.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={4}
              align="center"
            >
              No Categories Found
            </TableCell>
          </TableRow>
        )}
              </TableBody>
    </Table>
  </TableContainer>

  <CategoryDialog
    open={dialogOpen}
    onClose={() => {
      setDialogOpen(false);
      setSelectedCategory(null);
    }}
    onSave={handleSave}
    category={selectedCategory}
  />

  <Snackbar
    open={snackbar.open}
    autoHideDuration={3000}
    onClose={() =>
      setSnackbar({
        ...snackbar,
        open: false,
      })
    }
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
  >
    <Alert
      severity={snackbar.severity}
      variant="filled"
      onClose={() =>
        setSnackbar({
          ...snackbar,
          open: false,
        })
      }
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
</Box>
);
}