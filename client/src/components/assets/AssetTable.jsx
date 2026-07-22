import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import QrCode2Icon from "@mui/icons-material/QrCode2";

import QRCodeDialog from "../qr/QRCodeDialog";

function AssetTable({ assets, loading }) {

  const [selectedAsset, setSelectedAsset] = useState(null);

  const [openQR, setOpenQR] = useState(false);
  const navigate = useNavigate();

  const handleOpenQR = (asset) => {
    setSelectedAsset(asset);
    setOpenQR(true);
  };

  const handleCloseQR = () => {
    setOpenQR(false);
    setSelectedAsset(null);
  };  const columns = [
    {
      field: "assetCode",
      headerName: "Code",
      flex: 1,
    },
    {
      field: "assetName",
      headerName: "Asset Name",
      flex: 2,
    },
    {
      field: "serialNumber",
      headerName: "Serial Number",
      flex: 2,
    },
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      flex: 1.5,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1.2,

      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "AVAILABLE"
              ? "success"
              : params.value === "ASSIGNED"
              ? "warning"
              : "error"
          }
        />
      ),
    },
    {
  field: "qr",
  headerName: "QR",
  width: 90,

  sortable: false,

  renderCell: (params) => (
    <Tooltip title="View QR Code">

      <IconButton
        color="primary"
        onClick={() => handleOpenQR(params.row)}
      >
        <QrCode2Icon />
      </IconButton>

    </Tooltip>
  ),
},
{
  field: "actions",
  headerName: "Actions",
  width: 120,
  sortable: false,

  renderCell: (params) => (
    <Tooltip title="View Details">
      <IconButton
        color="primary"
        onClick={() => navigate(`/assets/${params.row.assetCode}`)}
      >
        <VisibilityIcon />
      </IconButton>
    </Tooltip>
  ),
},
  ];

  return (
  <>

    <Paper elevation={4}>

      <DataGrid
        autoHeight
        rows={assets}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
      />

    </Paper>

    <QRCodeDialog
      open={openQR}
      onClose={handleCloseQR}
      asset={selectedAsset}
    />

  </>
);
}

export default AssetTable;