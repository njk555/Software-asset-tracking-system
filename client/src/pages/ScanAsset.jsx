import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

export default function ScanAsset() {

  const navigate = useNavigate();

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {

        scanner.clear();

        try {

          const url = new URL(decodedText);

          const assetCode =
            url.pathname.split("/").pop();

          navigate(`/assets/${assetCode}`);

        } catch {

          alert("Invalid QR Code");

        }

      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };

  }, []);

  return (
    <Box p={4}>

      <Typography
        variant="h4"
        mb={3}
        fontWeight="bold"
      >
        Scan Asset QR
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: 3,
          maxWidth: 500,
          margin: "auto",
        }}
      >
        <div id="reader"></div>
      </Paper>

    </Box>
  );
}