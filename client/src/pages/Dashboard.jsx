import React, { useEffect, useState } from "react";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleIcon from "@mui/icons-material/People";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import { getDashboard } from "../services/dashboard.service";

export default function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [counts, setCounts] = useState({
  assets: 0,
  vendors: 0,
  categories: 0,
  locations: 0,
  departments: 0,
  employees: 0,

  openTickets: 0,
  activeAmc: 0,
  expiringAmc: 0,
  notifications: 0,
});

  const [recentAssets, setRecentAssets] = useState([]);

  const cards = [
    {
      title: "Assets",
      value: counts.assets,
      icon: <InventoryIcon sx={{ fontSize: 45 }} />,
      color: "#1976d2",
    },
    {
      title: "Vendors",
      value: counts.vendors,
      icon: <BusinessIcon sx={{ fontSize: 45 }} />,
      color: "#43a047",
    },
    {
      title: "Categories",
      value: counts.categories,
      icon: <CategoryIcon sx={{ fontSize: 45 }} />,
      color: "#fb8c00",
    },
    {
      title: "Locations",
      value: counts.locations,
      icon: <LocationOnIcon sx={{ fontSize: 45 }} />,
      color: "#8e24aa",
    },
    {
      title: "Departments",
      value: counts.departments,
      icon: <ApartmentIcon sx={{ fontSize: 45 }} />,
      color: "#3949ab",
    },
    {
      title: "Employees",
      value: counts.employees,
      icon: <PeopleIcon sx={{ fontSize: 45 }} />,
      color: "#00897b",
    },
    {
  title: "Open Tickets",
  value: counts.openTickets,
  icon: <ConfirmationNumberIcon sx={{ fontSize: 45 }} />,
  color: "#e53935",
},
{
  title: "Active AMC",
  value: counts.activeAmc,
  icon: <BuildCircleIcon sx={{ fontSize: 45 }} />,
  color: "#2e7d32",
},
{
  title: "AMC Expiring",
  value: counts.expiringAmc,
  icon: <WarningAmberIcon sx={{ fontSize: 45 }} />,
  color: "#fb8c00",
},
{
  title: "Notifications",
  value: counts.notifications,
  icon: <NotificationsActiveIcon sx={{ fontSize: 45 }} />,
  color: "#8e24aa",
},
  ];

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const response = await getDashboard();

      setCounts(response.data.counts);

      setRecentAssets(response.data.recentAssets);

    } catch (error) {

      console.error("Dashboard Error:", error);

    }

  };

  return (

    <Box sx={{ p: 4 }}>

      <Typography
        variant="h3"
        fontWeight="bold"
      >
        Welcome, {user?.fullName || user?.name || "User"}
      </Typography>

      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Software Asset Tracking Dashboard
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{ mb: 5 }}
      >

        {cards.map((card) => (

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={card.title}
          >

            <Card
              elevation={5}
              sx={{
                borderRadius: 3,
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 8,
                },
              }}
            >

              <CardContent>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >

                  <Box>

                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h3"
                      fontWeight="bold"
                    >
                      {card.value}
                    </Typography>

                  </Box>

                  <Box
                    sx={{
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>

                </Box>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 2 }}
      >
        Recent Assets
      </Typography>

      <TableContainer
        component={Paper}
        elevation={4}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell><b>Asset Code</b></TableCell>

              <TableCell><b>Asset Name</b></TableCell>

              <TableCell><b>Serial Number</b></TableCell>

              <TableCell><b>Status</b></TableCell>

              <TableCell><b>Purchase Date</b></TableCell>

            </TableRow>

          </TableHead>

          <TableBody>
                        {recentAssets.length > 0 ? (

              recentAssets.map((asset) => (

                <TableRow
                  key={asset.id}
                  hover
                >

                  <TableCell>
                    {asset.assetCode}
                  </TableCell>

                  <TableCell>
                    {asset.assetName}
                  </TableCell>

                  <TableCell>
                    {asset.serialNumber || "-"}
                  </TableCell>

                  <TableCell>

                    <Typography
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 0.5,
                        borderRadius: 5,
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 13,
                        backgroundColor:
                          asset.status === "AVAILABLE"
                            ? "#2e7d32"
                            : asset.status === "ASSIGNED"
                            ? "#ef6c00"
                            : asset.status === "MAINTENANCE"
                            ? "#1565c0"
                            : "#757575",
                      }}
                    >
                      {asset.status}
                    </Typography>

                  </TableCell>

                  <TableCell>

                    {asset.purchaseDate
                      ? new Date(asset.purchaseDate)
                          .toLocaleDateString("en-GB")
                      : "-"}

                  </TableCell>

                </TableRow>

              ))

            ) : (

              <TableRow>

                <TableCell
                  colSpan={5}
                  align="center"
                >

                  No Assets Found

                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </TableContainer>

    </Box>

  );

}