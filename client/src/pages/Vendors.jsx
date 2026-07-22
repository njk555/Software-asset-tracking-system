import { useEffect, useState } from "react";
import VendorDialog from "../components/vendors/VendorDialog";

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



import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  importVendors,
} from "../services/vendor.service";



export default function Vendors() {

  const [vendors, setVendors] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedVendor, setSelectedVendor] =
    useState(null);

  const [progress, setProgress] = useState(0);

  const [uploading, setUploading] =
    useState(false);

  const [snackbar, setSnackbar] = useState({

    open: false,

    severity: "success",

    message: "",

  });

  const loadVendors = async () => {

    try {

      const res = await getVendors();

      const data = res.data.data || [];

      setVendors(data);

      setFiltered(data);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    loadVendors();

  }, []);

  useEffect(() => {

    const value = search.toLowerCase();

    setFiltered(

      vendors.filter(

        (vendor) =>

          vendor.name
            .toLowerCase()
            .includes(value)

          ||

          (vendor.contactPerson || "")
            .toLowerCase()
            .includes(value)

          ||

          (vendor.email || "")
            .toLowerCase()
            .includes(value)

      )

    );

  }, [search, vendors]);

  const handleImport = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    setProgress(0);

    try {

      await importVendors(

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

        message: "Vendors Imported Successfully",

      });

      loadVendors();

    } catch (err) {

      setSnackbar({

        open: true,

        severity: "error",

        message:

          err.response?.data?.message ||

          "Import Failed",

      });

    }

    finally {

      setUploading(false);

    }

  };

  const handleSave = async (data) => {

    try {

      if (selectedVendor) {

        await updateVendor(

          selectedVendor.id,

          data

        );

        setSnackbar({

          open: true,

          severity: "success",

          message: "Vendor Updated",

        });

      }

      else {

        await createVendor(data);

        setSnackbar({

          open: true,

          severity: "success",

          message: "Vendor Added",

        });

      }

      setDialogOpen(false);

      setSelectedVendor(null);

      loadVendors();

    }

    catch (err) {

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

    if (!window.confirm("Delete Vendor?"))

      return;

    try {

      await deleteVendor(id);

      setSnackbar({

        open: true,

        severity: "success",

        message: "Vendor Deleted",

      });

      loadVendors();

    }

    catch (err) {

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
      Vendors
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
        placeholder="Search Vendors..."
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
            setSelectedVendor(null);
            setDialogOpen(true);
          }}
        >
          ADD VENDOR
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
              <b>Contact Person</b>
            </TableCell>

            <TableCell>
              <b>Email</b>
            </TableCell>

            <TableCell>
              <b>Phone</b>
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

          {filtered.map((vendor) => (

            <TableRow key={vendor.id}>

              <TableCell>
                {vendor.name}
              </TableCell>

              <TableCell>
                {vendor.contactPerson || "-"}
              </TableCell>

              <TableCell>
                {vendor.email || "-"}
              </TableCell>

              <TableCell>
                {vendor.phone || "-"}
              </TableCell>

              <TableCell>
                {vendor.status || "ACTIVE"}
              </TableCell>

              <TableCell align="center">

                <IconButton
                  color="primary"
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setDialogOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() =>
                    handleDelete(vendor.id)
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
                colSpan={6}
                align="center"
              >
                No Vendors Found
              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>

    </TableContainer>

    <VendorDialog
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false);
        setSelectedVendor(null);
      }}
      onSave={handleSave}
      vendor={selectedVendor}
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