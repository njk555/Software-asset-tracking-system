import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAssetByCode,
  getAssetHistory,
} from "../services/asset.service";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";

export default function AssetDetails() {

  const { assetCode } = useParams();

  const [asset, setAsset] = useState(null);
  const [history, setHistory] = useState({
  assignments: [],
  auditLogs: [],
});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAsset();
  }, []);

  const loadAsset = async () => {

    try {

      const res = await getAssetByCode(assetCode);
      

      setAsset(res.data.data);
      const historyRes = await getAssetHistory(res.data.data.id);

setHistory(historyRes.data.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
    

  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={8}
      >
        <CircularProgress />
      </Box>
    );

  if (!asset)
    return (
      <Typography align="center" mt={8}>
        Asset not found
      </Typography>
    );

  return (
    <Box p={5}>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Asset Details
      </Typography>

      <Card elevation={5}>

        <CardContent>

          <Grid container spacing={3}>

            <Grid item xs={12} md={6}>
              <Typography><b>Asset Code</b></Typography>
              <Typography>{asset.assetCode}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Asset Name</b></Typography>
              <Typography>{asset.assetName}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Serial Number</b></Typography>
              <Typography>{asset.serialNumber || "-"}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Manufacturer</b></Typography>
              <Typography>{asset.manufacturer || "-"}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Model</b></Typography>
              <Typography>{asset.model || "-"}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Status</b></Typography>

              <Chip
                label={asset.status}
                color={
                  asset.status === "AVAILABLE"
                    ? "success"
                    : asset.status === "ASSIGNED"
                    ? "warning"
                    : "error"
                }
              />

            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Category</b></Typography>
              <Typography>
                {asset.category?.name || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Vendor</b></Typography>
              <Typography>
                {asset.vendor?.name || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Location</b></Typography>
              <Typography>
                {asset.location?.name || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Assigned Employee</b></Typography>
              <Typography>
                {asset.employee
                  ? `${asset.employee.firstName} ${asset.employee.lastName}`
                  : "Not Assigned"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Purchase Date</b></Typography>
              <Typography>
                {asset.purchaseDate
                  ? asset.purchaseDate.substring(0,10)
                  : "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Warranty Expiry</b></Typography>
              <Typography>
                {asset.warrantyExpiry
                  ? asset.warrantyExpiry.substring(0,10)
                  : "-"}
              </Typography>
            </Grid>

          </Grid>

        </CardContent>

      </Card>
      <Card sx={{ mt: 3 }} elevation={5}>
  <CardContent>
    <Typography variant="h6" gutterBottom>
      Assignment History
    </Typography>

    {history.assignments.length === 0 ? (
      <Typography>No assignment history.</Typography>
    ) : (
      history.assignments.map((item) => (
        <Box
          key={item.id}
          sx={{
            borderLeft: "4px solid #1976d2",
            pl: 2,
            mb: 2,
          }}
        >
          <Typography fontWeight="bold">
            {item.employee.firstName} {item.employee.lastName}
          </Typography>

          <Typography variant="body2">
            Assigned:
            {" "}
            {new Date(item.assignedAt).toLocaleDateString()}
          </Typography>

          <Typography variant="body2">
            Returned:
            {" "}
            {item.returnedAt
              ? new Date(item.returnedAt).toLocaleDateString()
              : "Current Holder"}
          </Typography>

          <Typography variant="body2">
            Assigned By: {item.assignedByName}
          </Typography>

          {item.returnedByName && (
            <Typography variant="body2">
              Returned By: {item.returnedByName}
            </Typography>
          )}

          {item.remarks && (
            <Typography variant="body2">
              Remarks: {item.remarks}
            </Typography>
          )}
        </Box>
      ))
    )}
  </CardContent>
</Card>

    </Box>
  );

}