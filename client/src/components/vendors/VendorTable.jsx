import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function VendorTable({
  vendors = [],
  onEdit,
  onDelete,
}) {
  return (
    <Paper elevation={3}>
      <Table>

        <TableHead>

          <TableRow>

            <TableCell><b>Name</b></TableCell>

            <TableCell><b>Contact</b></TableCell>

            <TableCell><b>Email</b></TableCell>

            <TableCell><b>Phone</b></TableCell>

            <TableCell><b>Status</b></TableCell>

            <TableCell align="center">
              <b>Actions</b>
            </TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {vendors.map((vendor) => (

            <TableRow key={vendor.id} hover>

              <TableCell>{vendor.name}</TableCell>

              <TableCell>{vendor.contactPerson}</TableCell>

              <TableCell>{vendor.email}</TableCell>

              <TableCell>{vendor.phone}</TableCell>

              <TableCell>

                <Chip
                  label="Active"
                  color="success"
                  size="small"
                />

              </TableCell>

              <TableCell align="center">

                <IconButton
                  color="primary"
                  onClick={() => onEdit(vendor)}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => onDelete(vendor)}
                >
                  <DeleteIcon />
                </IconButton>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </Paper>
  );
}

export default VendorTable;