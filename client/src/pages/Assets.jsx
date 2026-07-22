import { getAssets } from "../services/asset.service";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AssetDialog from "../components/assets/AssetDialog";
import { createAsset } from "../services/asset.service";
import ExcelUpload from "../components/common/Excelupload";
import QrCodeScannerIcon
from "@mui/icons-material/QrCodeScanner";

import { useNavigate }
from "react-router-dom";



import AssetTable from "../components/assets/AssetTable";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    const filtered = assets.filter(
      (asset) =>
        asset.assetCode?.toLowerCase().includes(search.toLowerCase()) ||
        asset.assetName?.toLowerCase().includes(search.toLowerCase()) ||
        asset.serialNumber?.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredAssets(filtered);
  }, [search, assets]);

  const loadAssets = async () => {
    try {
      const res = await getAssets();

      setAssets(res.data.data);
      setFilteredAssets(res.data.data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };
  const handleAddAsset = () => {
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
};

const handleSaveAsset = async (data) => {
  try {
    await createAsset(data);

    handleCloseDialog();

    loadAssets(); // Refresh table

  } catch (err) {
    console.error(err);
    alert("Unable to save asset");
  }
};
const navigate = useNavigate();

  return (
    <Box p={4}>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Assets
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
          placeholder="Search Assets..."
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
    display="flex"
    gap={2}
>

    <ExcelUpload
        onSuccess={loadAssets}
    />

    <Button
        variant="outlined"
        href="/templates/assets.xlsx"
    >
        Download Template
    </Button>
    <Button
    variant="contained"
    color="success"
    startIcon={<QrCodeScannerIcon />}
    onClick={() => navigate("/scan")}
>
    Scan QR
</Button>

    <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddAsset}
    >
        ADD ASSET
    </Button>
    

</Box>

      </Paper>

      <AssetTable
        assets={filteredAssets}
        loading={loading}
      />
      <AssetDialog
    open={openDialog}
    onClose={handleCloseDialog}
    onSave={handleSaveAsset}
    vendors={[]}
    categories={[]}
    locations={[]}
/>

    </Box>
  );
}

export default Assets;