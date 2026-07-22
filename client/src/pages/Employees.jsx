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
  LinearProgress,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import EmployeeDialog from "../components/employees/EmployeeDialog";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employee.service";

import { getDepartments } from "../services/department.service";

import {
  importEmployees,
} from "../services/EmployeeImport.service";

export default function Employees() {

  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  //-----------------------------------------
  // Load Employees
  //-----------------------------------------

  const loadEmployees = async () => {
    try {

      const res = await getEmployees();

      const data = res.data.data || [];

      setEmployees(data);
      setFiltered(data);

    } catch (err) {

      console.error(err);

    }
  };

  //-----------------------------------------
  // Load Departments
  //-----------------------------------------

  const loadDepartments = async () => {

    try {

      const res = await getDepartments();

      setDepartments(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  //-----------------------------------------
  // Initial Load
  //-----------------------------------------

  useEffect(() => {

    loadEmployees();
    loadDepartments();

  }, []);

  //-----------------------------------------
  // Search Filter
  //-----------------------------------------

  useEffect(() => {

    const value = search.toLowerCase();

    const filteredEmployees = employees.filter((employee) => {

      const fullName =
        `${employee.firstName || ""} ${employee.lastName || ""}`;

      return (

        fullName.toLowerCase().includes(value)

        ||

        (employee.email || "")
          .toLowerCase()
          .includes(value)

        ||

        (employee.phone || "")
          .includes(value)

        ||

        (employee.designation || "")
          .toLowerCase()
          .includes(value)

        ||

        (employee.department?.name || "")
          .toLowerCase()
          .includes(value)

      );

    });

    setFiltered(filteredEmployees);

  }, [search, employees]);

  //-----------------------------------------
  // Import Excel
  //-----------------------------------------

  const handleImport = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

      setUploading(true);
      setProgress(0);

      await importEmployees(
        file,
        (event) => {

          const percent = Math.round(
            (event.loaded * 100) / event.total
          );

          setProgress(percent);

        }
      );

      setSnackbar({
        open: true,
        severity: "success",
        message: "Employees Imported Successfully",
      });

      loadEmployees();

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

  //-----------------------------------------
  // Save Employee
  //-----------------------------------------

  const handleSave = async (data) => {

    try {

      if (selectedEmployee) {

        await updateEmployee(
          selectedEmployee.id,
          data
        );

        setSnackbar({
          open: true,
          severity: "success",
          message: "Employee Updated Successfully",
        });

      } else {

        await createEmployee(data);

        setSnackbar({
          open: true,
          severity: "success",
          message: "Employee Added Successfully",
        });

      }

      setDialogOpen(false);
      setSelectedEmployee(null);

      loadEmployees();

    } catch (err) {

      console.error(err);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          err.response?.data?.message ||
          "Operation Failed",
      });

    }

  };

  //-----------------------------------------
  // Delete Employee
  //-----------------------------------------

  const handleDelete = async (id) => {

    if (!window.confirm("Delete Employee?"))
      return;

    try {

      await deleteEmployee(id);

      setSnackbar({
        open: true,
        severity: "success",
        message: "Employee Deleted Successfully",
      });

      loadEmployees();

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
        variant="h3"
        fontWeight="bold"
        gutterBottom
    >
        Employees
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
            placeholder="Search Employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 440 }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />

        <Box display="flex" gap={2}>

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

                    setSelectedEmployee(null);
                    setDialogOpen(true);

                }}
            >
                ADD EMPLOYEE
            </Button>

        </Box>

    </Paper>

    {uploading && (

        <Box mb={2}>

            <Typography>
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
                        <strong>Name</strong>
                    </TableCell>

                    <TableCell>
                        <strong>Email</strong>
                    </TableCell>

                    <TableCell>
                        <strong>Phone</strong>
                    </TableCell>

                    <TableCell>
                        <strong>Designation</strong>
                    </TableCell>

                    <TableCell>
                        <strong>Department</strong>
                    </TableCell>

                    <TableCell align="center">
                        <strong>Actions</strong>
                    </TableCell>

                </TableRow>

            </TableHead>

            <TableBody>

                {filtered.length > 0 ? (

                    filtered.map((employee) => (

                        <TableRow key={employee.id} hover>

                            <TableCell>

                                {`${employee.firstName || ""} ${employee.lastName || ""}`}

                            </TableCell>

                            <TableCell>

                                {employee.email || "-"}

                            </TableCell>

                            <TableCell>

                                {employee.phone || "-"}

                            </TableCell>

                            <TableCell>

                                {employee.designation || "-"}

                            </TableCell>

                            <TableCell>

                                {employee.department?.name || "-"}

                            </TableCell>

                            <TableCell align="center">

                                <IconButton
                                    color="primary"
                                    onClick={() => {

                                        setSelectedEmployee(employee);
                                        setDialogOpen(true);

                                    }}
                                >
                                    <EditIcon />
                                </IconButton>

                                <IconButton
                                    color="error"
                                    onClick={() =>
                                        handleDelete(employee.id)
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>

                            </TableCell>

                        </TableRow>

                    ))

                ) : (

                    <TableRow>

                        <TableCell
                            colSpan={6}
                            align="center"
                        >

                            No Employees Found

                        </TableCell>

                    </TableRow>

                )}

            </TableBody>

        </Table>

    </TableContainer>
          <EmployeeDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedEmployee(null);
        }}
        onSave={handleSave}
        employee={selectedEmployee}
        departments={departments}
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
          vertical: "bottom",
          horizontal: "left",
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
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>

  );

}