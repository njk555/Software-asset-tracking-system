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
  
} from "@mui/material";


import InputAdornment from "@mui/material/InputAdornment";

import {
    LinearProgress,
} from "@mui/material";

import { importLocations }
from "../services/LocationImport.service";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import LocationDialog from "../components/locations/LocationDialog";

import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../services/location.service";

export default function Locations() {

  const [locations, setLocations] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");

  
  
  const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);

const [dialogOpen, setDialogOpen] = useState(false);
const [selectedLocation, setSelectedLocation] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const loadLocations = async () => {

    try {

      const res = await getLocations();

      const data = res.data.data || [];

      setLocations(data);
      setFiltered(data);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {

    const value = search.toLowerCase();

    setFiltered(

      locations.filter(

        (location) =>

          location.name
            .toLowerCase()
            .includes(value) ||

          (location.building || "")
            .toLowerCase()
            .includes(value) ||

          (location.floor || "")
            .toLowerCase()
            .includes(value) ||

          (location.room || "")
            .toLowerCase()
            .includes(value)

      )

    );

  }, [search, locations]);

  const handleSave = async (data) => {

    try {

      if (selectedLocation) {

        await updateLocation(
          selectedLocation.id,
          data
        );

        setSnackbar({
          open: true,
          severity: "success",
          message: "Location updated successfully",
        });

      } else {

        await createLocation(data);

        setSnackbar({
          open: true,
          severity: "success",
          message: "Location added successfully",
        });

      }

      setDialogOpen(false);
      setSelectedLocation(null);

      loadLocations();

    } catch (err) {

      setSnackbar({
        open: true,
        severity: "error",
        message:
          err.response?.data?.message ||
          "Operation failed",
      });

    }

  };
  const handleImport = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

        setUploading(true);
        setUploadProgress(0);

        await importLocations(
            file,
            (progressEvent) => {

                const percent =
                    Math.round(
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
                "Locations Imported Successfully",
        });

        loadLocations();

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

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this location?"))
      return;

    try {

      await deleteLocation(id);

      setSnackbar({
        open: true,
        severity: "success",
        message: "Location deleted successfully",
      });

      loadLocations();

    } catch (err) {

      setSnackbar({
        open: true,
        severity: "error",
        message:
          err.response?.data?.message ||
          "Delete failed",
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
        Locations
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
        placeholder="Search Locations..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        sx={{ width:350 }}
        InputProps={{
            startAdornment:(
                <InputAdornment position="start">
                    <SearchIcon/>
                </InputAdornment>
            )
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
            onClick={()=>{
                setSelectedLocation(null);
                setDialogOpen(true);
            }}
        >
            ADD LOCATION
        </Button>

    </Box>

</Paper>

      <TableContainer component={Paper}>
        {
uploading && (

<Box sx={{mb:2}}>

<Typography>

Uploading...
{uploadProgress}%

</Typography>

<LinearProgress
variant="determinate"
value={uploadProgress}
/>

</Box>

)
}
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>

              <TableCell>
                <b>Building</b>
              </TableCell>

              <TableCell>
                <b>Floor</b>
              </TableCell>

              <TableCell>
                <b>Room</b>
              </TableCell>

              <TableCell align="center">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {filtered.map((location) => (

              <TableRow key={location.id}>

                <TableCell>
                  {location.name}
                </TableCell>

                <TableCell>
                  {location.building || "-"}
                </TableCell>

                <TableCell>
                  {location.floor || "-"}
                </TableCell>

                <TableCell>
                  {location.room || "-"}
                </TableCell>

                <TableCell align="center">

                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedLocation(location);
                      setDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDelete(location.id)
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
                  colSpan={5}
                  align="center"
                >
                  No Locations Found
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>
      </TableContainer>

      <LocationDialog
    open={dialogOpen}
    onClose={()=>{
        setDialogOpen(false);
        setSelectedLocation(null);
    }}
    onSave={handleSave}
    location={selectedLocation}
/>

      <Snackbar
    open={snackbar.open}
    autoHideDuration={3000}
    onClose={() =>
        setSnackbar({
            ...snackbar,
            open:false,
        })
    }
>
    <Alert severity={snackbar.severity}>
        {snackbar.message}
    </Alert>
</Snackbar>

    </Box>
  );
}