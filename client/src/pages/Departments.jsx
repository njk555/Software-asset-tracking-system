import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Paper,
  IconButton,
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
  InputAdornment,
  LinearProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import DepartmentDialog from "../components/departments/DepartmentDialog";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/department.service";

import {
  importDepartments,
} from "../services/departmentImport.service";

export default function Departments() {

  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const [progress, setProgress] = useState(0);

  const [uploading, setUploading] =
    useState(false);

  const [snackbar, setSnackbar] = useState({

    open: false,

    severity: "success",

    message: "",

  });

  const loadDepartments = async () => {

    try {

      const res = await getDepartments();

      const data = res.data.data || [];

      setDepartments(data);

      setFiltered(data);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    loadDepartments();

  }, []);

  useEffect(() => {

    const value = search.toLowerCase();

    setFiltered(

      departments.filter(

        (department) =>

          department.name
            .toLowerCase()
            .includes(value)

          ||

          (department.description || "")
            .toLowerCase()
            .includes(value)

          ||

          (department.manager || "")
            .toLowerCase()
            .includes(value)

      )

    );

  }, [search, departments]);

  const handleImport = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    setProgress(0);

    try {

      await importDepartments(

        file,

        (event) => {

          const percent = Math.round(

            (event.loaded * 100) /

            event.total

          );

          setProgress(percent);

        }

      );

      setSnackbar({

        open: true,

        severity: "success",

        message: "Departments Imported Successfully",

      });

      loadDepartments();

    } catch (err) {

      setSnackbar({

        open: true,

        severity: "error",

        message:

          err.response?.data?.message ||

          "Import Failed",

      });

    } finally {

      setUploading(false);

    }

  };

  const handleSave = async (data) => {

    try {

      if (selectedDepartment) {

        await updateDepartment(

          selectedDepartment.id,

          data

        );

        setSnackbar({

          open: true,

          severity: "success",

          message: "Department Updated",

        });

      } else {

        await createDepartment(data);

        setSnackbar({

          open: true,

          severity: "success",

          message: "Department Added",

        });

      }

      setDialogOpen(false);

      setSelectedDepartment(null);

      loadDepartments();

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

    if (!window.confirm("Delete Department?"))

      return;

    try {

      await deleteDepartment(id);

      setSnackbar({

        open: true,

        severity: "success",

        message: "Department Deleted",

      });

      loadDepartments();

    } catch (err) {

      setSnackbar({

        open: true,

        severity: "error",

        message:

          err.response?.data?.message ||

          "Delete Failed",

      });

    }

  };
  return (
  <Box p={4}>

    <Typography
      variant="h4"
      fontWeight="bold"
      mb={3}
    >
      Departments
    </Typography>

    <Paper
      sx={{
        p: 3,
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >

      <TextField
        placeholder="Search Departments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
        sx={{
          display: "flex",
          gap: 2,
        }}
      >

        <Button
          variant="outlined"
          component="label"
        >
          Import Excel

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
            setSelectedDepartment(null);
            setDialogOpen(true);
          }}
        >
          ADD DEPARTMENT
        </Button>

      </Box>

    </Paper>

    {uploading && (

      <Box sx={{ mb: 3 }}>

        <Typography mb={1}>
          Uploading... {progress}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
        />

      </Box>

    )}

    <TableContainer component={Paper}>

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
              <b>Manager</b>
            </TableCell>

            <TableCell align="center">
              <b>Actions</b>
            </TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {filtered.map((department) => (

            <TableRow key={department.id}>

              <TableCell>
                {department.name}
              </TableCell>

              <TableCell>
                {department.description || "-"}
              </TableCell>

              <TableCell>
                {department.manager || "-"}
              </TableCell>

              <TableCell align="center">

                <IconButton
                  color="primary"
                  onClick={() => {
                    setSelectedDepartment(department);
                    setDialogOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() =>
                    handleDelete(department.id)
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

                No Departments Found

              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>

    </TableContainer>

    <DepartmentDialog
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false);
        setSelectedDepartment(null);
      }}
      onSave={handleSave}
      department={selectedDepartment}
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
    >
      <Alert
        severity={snackbar.severity}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>

  </Box>
);
}