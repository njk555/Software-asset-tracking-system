import { useEffect, useMemo, useState } from "react";

import {
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import PurchaseOrderDialog from "../components/PurchaseOrderDialog";

import {

    getPurchaseOrders,

    deletePurchaseOrder,
    downloadPurchaseOrder

} from "../services/purchaseOrder.service";

export default function PurchaseOrders() {

    const [purchaseOrders, setPurchaseOrders] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [openDialog, setOpenDialog] = useState(false);

    const [selectedPurchaseOrder,
        setSelectedPurchaseOrder] = useState(null);

    const [page, setPage] = useState(0);

    const [rowsPerPage,
        setRowsPerPage] = useState(10);

    useEffect(() => {

        loadPurchaseOrders();

    }, []);

    const loadPurchaseOrders = async () => {

        try {

            setLoading(true);

            const data =
                await getPurchaseOrders();

            setPurchaseOrders(data);

        }

        catch (err) {

            console.log(err);

            alert("Failed to load Purchase Orders");

        }

        finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (

            !window.confirm(

                "Delete this Purchase Order?"

            )

        )

            return;

        try {

            await deletePurchaseOrder(id);

            loadPurchaseOrders();

        }

        catch (err) {

            console.log(err);

            alert("Delete failed");

        }

    };

    const handleDownload = async (po) => {
        try {
            const pdf = await downloadPurchaseOrder(po.id);
            const url = window.URL.createObjectURL(pdf);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${po.poNumber}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Failed to download the Purchase Order PDF");
        }
    };

    const filteredPurchaseOrders =
        useMemo(() => {

            return purchaseOrders.filter(po =>

                po.poNumber
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                po.vendor?.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

            );

        }, [purchaseOrders, search]);

    return (

        <Box p={3}>

            <Box

                display="flex"

                justifyContent="space-between"

                alignItems="center"

                mb={3}

            >

                <Typography

                    variant="h4"

                    fontWeight="bold"

                >

                    Purchase Orders

                </Typography>

                <Box>

                    <Button

                        startIcon={<RefreshIcon />}

                        sx={{ mr: 2 }}

                        onClick={loadPurchaseOrders}

                    >

                        Refresh

                    </Button>

                    <Button

                        variant="contained"

                        startIcon={<AddIcon />}

                        onClick={() => {

                            setSelectedPurchaseOrder(null);

                            setOpenDialog(true);

                        }}

                    >

                        New Purchase Order

                    </Button>

                </Box>

            </Box>

            <TextField

                fullWidth

                label="Search PO Number or Vendor"

                value={search}

                onChange={(e) =>

                    setSearch(e.target.value)

                }

                sx={{ mb: 3 }}

            />

            <Paper>

                <TableContainer>

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>

                                    <b>PO Number</b>

                                </TableCell>

                                <TableCell>

                                    <b>Vendor</b>

                                </TableCell>

                                <TableCell>

                                    <b>Order Date</b>

                                </TableCell>

                                <TableCell>

                                    <b>Total Amount</b>

                                </TableCell>

                                <TableCell>

                                    <b>Status</b>

                                </TableCell>

                                <TableCell align="center">

                                    <b>Actions</b>

                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>
                            <TableBody>

{
    filteredPurchaseOrders
        .slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        )
        .map((po) => (

            <TableRow
                hover
                key={po.id}
            >

                <TableCell>
                    {po.poNumber}
                </TableCell>

                <TableCell>
                    {po.vendor?.name}
                </TableCell>

                <TableCell>

                    {
                        po.orderDate
                            ? new Date(po.orderDate)
                                  .toLocaleDateString()
                            : "-"
                    }

                </TableCell>

                <TableCell>

                    ₹
                    {Number(
                        po.totalAmount
                    ).toLocaleString()}

                </TableCell>

                <TableCell>

                    <Chip

                        label={po.status}

                        color={
                            po.status === "DRAFT"
                                ? "default"
                                : po.status === "APPROVED"
                                ? "primary"
                                : po.status === "ORDERED"
                                ? "warning"
                                : po.status === "RECEIVED"
                                ? "success"
                                : "secondary"
                        }

                    />

                </TableCell>

                <TableCell align="center">

                    <IconButton

                        color="primary"

                        onClick={() => {

                            setSelectedPurchaseOrder(po);

                            setOpenDialog(true);

                        }}

                    >

                        <EditIcon />

                    </IconButton>

                    <IconButton

                        color="secondary"

                        onClick={() => handleDownload(po)}

                    >

                        <PictureAsPdfIcon />

                    </IconButton>

                    <IconButton

                        color="error"

                        onClick={() =>
                            handleDelete(po.id)
                        }

                    >

                        <DeleteIcon />

                    </IconButton>

                </TableCell>

            </TableRow>

        ))
}

{
    filteredPurchaseOrders.length === 0 && (

        <TableRow>

            <TableCell

                colSpan={6}

                align="center"

            >

                No Purchase Orders Found

            </TableCell>

        </TableRow>

    )
}

</TableBody>
                        </TableBody>
                                            </Table>

                </TableContainer>

                <TablePagination

                    component="div"

                    count={filteredPurchaseOrders.length}

                    page={page}

                    rowsPerPage={rowsPerPage}

                    onPageChange={(event, newPage) =>

                        setPage(newPage)

                    }

                    onRowsPerPageChange={(event) => {

                        setRowsPerPage(

                            parseInt(event.target.value, 10)

                        );

                        setPage(0);

                    }}

                    rowsPerPageOptions={[5, 10, 25, 50]}

                />

            </Paper>

            <PurchaseOrderDialog

                open={openDialog}

                onClose={() => {

                    setOpenDialog(false);

                    setSelectedPurchaseOrder(null);

                }}

                purchaseOrder={selectedPurchaseOrder}

                refresh={loadPurchaseOrders}

            />

        </Box>

    );

}
                        
