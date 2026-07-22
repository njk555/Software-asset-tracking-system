import AddIcon from "@mui/icons-material/Add";
import BuildIcon from "@mui/icons-material/Build";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import AmcDialog from "../components/amc/AmcDialog";

import {
  completeAmcService,
  getAmcContracts,
  getAmcNotifications,
  markAmcNotificationRead,
} from "../services/amc.service";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function AmcManagement() {
  const [contracts, setContracts] = useState([]); const [notifications, setNotifications] = useState([]); const [open, setOpen] = useState(false); const [error, setError] = useState("");
  const load = async () => { try { const [contractData, notificationData] = await Promise.all([getAmcContracts(), getAmcNotifications()]); setContracts(contractData); setNotifications(notificationData); setError(""); } catch { setError("Unable to load AMC data."); } };
  useEffect(() => { load(); }, []);
  const complete = async (id) => {
  try {
    setLoading(true);

    await completeAmcService(
      id,
      new Date().toISOString().slice(0, 10)
    );

    await load();

    setSnackbar({
      open: true,
      message: "Service completed successfully.",
      severity: "success",
    });
  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Could not record service completion."
    );
  } finally {
    setLoading(false);
  }
};
  const unread = notifications.filter((item) => !item.isRead);
  const [loading, setLoading] = useState(false);

const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success",
});

   return (
  <Box p={4}>
    <Typography variant="h4" fontWeight={700} mb={1}>
      AMC Management
    </Typography>

    <Typography color="text.secondary" mb={3}>
      Track asset AMC coverage, upcoming services, and expiry reminders.
    </Typography>

    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}

    {unread.length > 0 && (
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderLeft: "4px solid",
          borderColor: "warning.main",
        }}
      >
        <Typography
          fontWeight={700}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <NotificationsActiveIcon color="warning" />
          AMC Notifications ({unread.length})
        </Typography>

        {unread.map((notification) => (
          <Box
            key={notification.id}
            sx={{
              mt: 1,
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Chip
              size="small"
              label={notification.type.replaceAll("_", " ")}
              color={
                notification.type === "EXPIRY_REMINDER"
                  ? "error"
                  : "warning"
              }
            />

            <Typography variant="body2">
              {notification.message} Sent through Email + Mobile Push to{" "}
              {notification.recipient}.
            </Typography>

            <Button
              size="small"
              onClick={async () => {
                await markAmcNotificationRead(notification.id);
                load();
              }}
            >
              Mark Read
            </Button>
          </Box>
        ))}
      </Paper>
    )}

    <Paper
      sx={{
        p: 2,
        mb: 3,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Add AMC Contract
      </Button>
    </Paper>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Contract</TableCell>
            <TableCell>Asset</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell>Expiry</TableCell>
            <TableCell>Next Service</TableCell>
            <TableCell>Status</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>
                <b>{contract.contractNumber}</b>
                <br />
                <Typography variant="caption">
                  Every {contract.serviceIntervalMonths} month(s)
                </Typography>
              </TableCell>

              <TableCell>
                {contract.asset.assetCode}
                <br />
                <Typography variant="caption">
                  {contract.asset.assetName}
                </Typography>
              </TableCell>

              <TableCell>{contract.vendor.name}</TableCell>

              <TableCell>
                {new Date(contract.expiryDate).toLocaleDateString()}
              </TableCell>

              <TableCell>
                {contract.nextServiceDate
                  ? new Date(contract.nextServiceDate).toLocaleDateString()
                  : "-"}
              </TableCell>

              <TableCell>
                <Chip
                  size="small"
                  label={contract.status}
                  color={
                    contract.status === "ACTIVE"
                      ? "success"
                      : contract.status === "EXPIRED"
                      ? "error"
                      : "default"
                  }
                />
              </TableCell>

              <TableCell>
                {contract.status === "ACTIVE" && (
                  <Button
                    size="small"
                    startIcon={<BuildIcon />}
                    disabled={loading}
                    onClick={() => complete(contract.id)}
                  >
                    {loading ? "Updating..." : "Service Done"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}

          {!contracts.length && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No AMC contracts yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() =>
        setSnackbar((prev) => ({
          ...prev,
          open: false,
        }))
      }
    >
      <Alert severity={snackbar.severity} variant="filled">
        {snackbar.message}
      </Alert>
    </Snackbar>

    <AmcDialog
      open={open}
      onClose={() => setOpen(false)}
      onSaved={load}
    />
  </Box>
);
}
