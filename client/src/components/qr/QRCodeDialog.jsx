import { useRef } from "react";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function QRCodeDialog({ open, onClose, asset }) {
  const qrRef = useRef(null);

  if (!asset) return null;

  const qrValue = `${window.location.origin}/assets/${asset.assetCode}`;

  const downloadQR = () => {
    const svg = qrRef.current.querySelector("svg");
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 300, 300);

      ctx.drawImage(img, 0, 0, 300, 300);

      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${asset.assetCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      window.btoa(unescape(encodeURIComponent(svgData)));
  };

  const printQR = () => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
      <head>
      <title>${asset.assetCode}</title>
      </head>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;font-family:Arial;">
          ${qrRef.current.innerHTML}
          <h2>${asset.assetCode}</h2>
          <p>${asset.assetName}</p>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Asset QR Code</DialogTitle>

      <DialogContent>
        <Box
          ref={qrRef}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          p={2}
        >
          <QRCode value={qrValue} size={220} />

          <Typography fontWeight="bold">
            {asset.assetCode}
          </Typography>

          <Typography>{asset.assetName}</Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={downloadQR}>
          Download
        </Button>

        <Button onClick={printQR}>
          Print
        </Button>

        <Button
          variant="contained"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}