import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

import TicketDialog from "../components/helpdesk/TicketDialog";

import {
  getTickets,
  deleteTicket,
} from "../services/ticket.service";

/* ---------------- STATUS COLORS ---------------- */

const statusColors = {
  OPEN: "error",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
  CLOSED: "info",
  REOPENED: "secondary",
  ON_HOLD: "default",
};

/* ---------------- PRIORITY COLORS ---------------- */

const priorityColors = {
  LOW: "success",
  MEDIUM: "info",
  HIGH: "warning",
  CRITICAL: "error",
};

const formatEnum = (value) =>
  value
    ? value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "-";

export default function Helpdesk() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    loadTickets();
  }, []);

  /* ---------------- LOAD TICKETS ---------------- */

  const loadTickets = async () => {
    try {
      setLoading(true);

      const res = await getTickets();

      console.log("Tickets API Response:", res.data);

      const ticketData = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      setTickets(ticketData);
    } catch (error) {
      console.error(error);

      setTickets([]);

      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to load tickets",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;

    try {
      await deleteTicket(id);

      setSnackbar({
        open: true,
        severity: "success",
        message: "Ticket deleted successfully",
      });

      loadTickets();
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        severity: "error",
        message: "Unable to delete ticket",
      });
    }
  };
    /* ---------------- FILTERED TICKETS ---------------- */

  const filteredTickets = useMemo(() => {
    if (!Array.isArray(tickets)) return [];

    return tickets.filter((ticket) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        searchText === "" ||
        ticket.title?.toLowerCase().includes(searchText) ||
        ticket.ticketNumber?.toLowerCase().includes(searchText) ||
        ticket.category?.toLowerCase().includes(searchText) ||
        ticket.department?.name?.toLowerCase().includes(searchText);

      const matchesStatus =
        !statusFilter || ticket.status === statusFilter;

      const matchesPriority =
        !priorityFilter || ticket.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tickets,
    search,
    statusFilter,
    priorityFilter,
  ]);

  /* ---------------- DASHBOARD STATS ---------------- */

  const stats = useMemo(() => {
    if (!Array.isArray(tickets)) {
      return {
        total: 0,
        open: 0,
        progress: 0,
        resolved: 0,
        closed: 0,
        reopened: 0,
        hold: 0,
      };
    }

    return {
      total: tickets.length,

      open: tickets.filter(
        (t) => t.status === "OPEN"
      ).length,

      progress: tickets.filter(
        (t) => t.status === "IN_PROGRESS"
      ).length,

      resolved: tickets.filter(
        (t) => t.status === "RESOLVED"
      ).length,

      closed: tickets.filter(
        (t) => t.status === "CLOSED"
      ).length,

      reopened: tickets.filter(
        (t) => t.status === "REOPENED"
      ).length,

      hold: tickets.filter(
        (t) => t.status === "ON_HOLD"
      ).length,
    };
  }, [tickets]);

  /* ---------------- HELPER FUNCTIONS ---------------- */

  const refreshTickets = () => {
    loadTickets();
  };

  const openNewTicketDialog = () => {
    setSelectedTicket(null);
    setOpenDialog(true);
  };

  const openEditDialog = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const viewTicket = (ticket) => {
    setSelectedTicket(ticket);
  };
    /* ---------------- DATA GRID COLUMNS ---------------- */

  const columns = [
    {
      field: "ticketNumber",
      headerName: "Ticket No.",
      width: 170,
    },

    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 150,
    },

    {
  field: "category",
  headerName: "Category",
  width: 150,

  renderCell: (params) => (
    params.row?.category
      ? formatEnum(params.row.category)
      : "-"
  ),
   },

    {
  field: "department",
  headerName: "Department",
  width: 120,

  renderCell: (params) => (
    params.row?.department?.name || "-"
  ),
},

    {
      field: "priority",
      headerName: "Priority",
      width: 140,

      renderCell: (params) => (
        <Chip
          label={formatEnum(params.value)}
          color={priorityColors[params.value] || "default"}
          size="small"
          variant="filled"
        />
      ),
    },

    {
      field: "status",
      headerName: "Status",
      width: 120,

      renderCell: (params) => (
        <Chip
          label={formatEnum(params.value)}
          color={statusColors[params.value] || "default"}
          size="small"
          variant="filled"
        />
      ),
    },

    {
  field: "createdAt",
  headerName: "Created",
  width: 170,

  renderCell: (params) =>
    params.row?.createdAt
      ? new Date(
          params.row.createdAt
        ).toLocaleDateString()
      : "-",
},

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,

      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={
            <Tooltip title="View">
              <VisibilityIcon />
            </Tooltip>
          }
          label="View"
          onClick={() => viewTicket(params.row)}
        />,

        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Edit">
              <EditIcon />
            </Tooltip>
          }
          label="Edit"
          onClick={() =>
            openEditDialog(params.row)
          }
        />,

        <GridActionsCellItem
          key="delete"
          icon={
            <Tooltip title="Delete">
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label="Delete"
          onClick={() =>
            handleDelete(params.row.id)
          }
        />,
      ],
    },
  ];
    return (
    <Box sx={{ p: 3 }}>
      {/* ---------------- DASHBOARD CARDS ---------------- */}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary">
                Total Tickets
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary">
                Open
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                color="error.main"
              >
                {stats.open}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary">
                In Progress
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                color="warning.main"
              >
                {stats.progress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="text.secondary">
                Resolved
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                color="success.main"
              >
                {stats.resolved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ---------------- MAIN CARD ---------------- */}

      <Card elevation={3}>
        <CardContent>
          {/* Header */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
            >
              <ConfirmationNumberIcon
                sx={{
                  mr: 1,
                  verticalAlign: "middle",
                }}
              />

              Helpdesk Tickets
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={refreshTickets}
              >
                Refresh
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openNewTicketDialog}
              >
                Raise Ticket
              </Button>
            </Box>
          </Box>

          {/* Filters */}

          <Grid
            container
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search tickets..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
                        {/* ---------------- STATUS FILTER ---------------- */}

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <MenuItem value="">All</MenuItem>

                <MenuItem value="OPEN">
                  Open
                </MenuItem>

                <MenuItem value="IN_PROGRESS">
                  In Progress
                </MenuItem>

                <MenuItem value="RESOLVED">
                  Resolved
                </MenuItem>

                <MenuItem value="CLOSED">
                  Closed
                </MenuItem>

                <MenuItem value="REOPENED">
                  Reopened
                </MenuItem>

                <MenuItem value="ON_HOLD">
                  On Hold
                </MenuItem>
              </TextField>
            </Grid>

            {/* ---------------- PRIORITY FILTER ---------------- */}

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Priority"
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
              >
                <MenuItem value="">All</MenuItem>

                <MenuItem value="LOW">
                  Low
                </MenuItem>

                <MenuItem value="MEDIUM">
                  Medium
                </MenuItem>

                <MenuItem value="HIGH">
                  High
                </MenuItem>

                <MenuItem value="CRITICAL">
                  Critical
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* ---------------- TABLE ---------------- */}

          {loading ? (
            <Box
              sx={{
                height: 500,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                height: 600,
                width: "100%",
              }}
            >
              <DataGrid
                rows={filteredTickets}
                columns={columns}
                getRowId={(row) => row.id}
                pageSizeOptions={[5, 10, 20, 50]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      page: 0,
                      pageSize: 10,
                    },
                  },
                }}
                disableRowSelectionOnClick
                loading={loading}
                autoHeight={false}
                sx={{
                  border: 0,

                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f5f5",
                    fontWeight: "bold",
                  },

                  "& .MuiDataGrid-cell": {
                    alignItems: "center",
                  },

                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid #e0e0e0",
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
            {/* ---------------- TICKET DIALOG ---------------- */}

      <TicketDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onSuccess={() => {
          loadTickets();
          setOpenDialog(false);
          setSelectedTicket(null);
        }}
      />

      {/* ---------------- SNACKBAR ---------------- */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
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
    </Box>
  );
}