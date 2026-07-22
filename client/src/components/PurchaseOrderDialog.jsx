import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    Typography,
    MenuItem,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    createPurchaseOrder,
    updatePurchaseOrder
} from "../services/purchaseOrder.service";

import { getVendors } from "../services/vendor.service";
import { getCategories } from "../services/category.service";

export default function PurchaseOrderDialog({

    open,
    onClose,
    purchaseOrder,
    refresh

}) {

    const [vendors, setVendors] = useState([]);
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({

        vendorId: "",

        orderDate: "",

        expectedDelivery: "",

        remarks: "",

        status: "DRAFT",

        items: [

            {

                assetName: "",

                categoryId: "",

                quantity: 1,

                unitPrice: 0

            }

        ]

    });

    useEffect(() => {

        loadData();

    }, []);

    useEffect(() => {

        if (purchaseOrder) {

            setForm({

                vendorId:
                    purchaseOrder.vendorId,

                orderDate:
                    purchaseOrder.orderDate
                        ?.substring(0, 10),

                expectedDelivery:
                    purchaseOrder.expectedDelivery
                        ?.substring(0, 10) || "",

                remarks:
                    purchaseOrder.remarks || "",

                status:
                    purchaseOrder.status,

                items:
                    purchaseOrder.items.map(item => ({

                        assetName:
                            item.assetName,

                        categoryId:
                            item.categoryId,

                        quantity:
                            item.quantity,

                        unitPrice:
                            item.unitPrice

                    }))

            });

        }

    }, [purchaseOrder]);

    async function loadData() {

        try {

            const vendorData =
                await getVendors();

            const categoryData =
                await getCategories();

            setVendors(vendorData);

            setCategories(categoryData);

        }
        catch (err) {

            console.log(err);

        }

    }

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value

        });

    };

    const handleItemChange = (

        index,

        field,

        value

    ) => {

        const rows = [...form.items];

        rows[index][field] = value;

        setForm({

            ...form,

            items: rows

        });

    };

    const addRow = () => {

        setForm({

            ...form,

            items: [

                ...form.items,

                {

                    assetName: "",

                    categoryId: "",

                    quantity: 1,

                    unitPrice: 0

                }

            ]

        });

    };

    const removeRow = (index) => {

        const rows = [...form.items];

        rows.splice(index, 1);

        setForm({

            ...form,

            items: rows

        });

    };
        /*
    ---------------------------------------
    Calculate Grand Total
    ---------------------------------------
    */

    const grandTotal = form.items.reduce(

        (sum, item) =>

            sum +

            (Number(item.quantity) || 0) *

            (Number(item.unitPrice) || 0),

        0

    );

    /*
    ---------------------------------------
    Save Purchase Order
    ---------------------------------------
    */

    const handleSave = async () => {

        try {

            if (!form.vendorId) {

                alert("Please select a Vendor");

                return;

            }

            if (form.items.length === 0) {

                alert("Add at least one Item");

                return;

            }

            for (const item of form.items) {

                if (

                    !item.assetName ||

                    !item.categoryId ||

                    item.quantity <= 0 ||

                    item.unitPrice <= 0

                ) {

                    alert("Complete all Item details");

                    return;

                }

            }

            if (purchaseOrder) {

                await updatePurchaseOrder(

                    purchaseOrder.id,

                    form

                );

            }

            else {

                await createPurchaseOrder(form);

            }

            refresh();

            onClose();

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Failed to save Purchase Order"

            );

        }

    };

    return (

        <Dialog

            open={open}

            onClose={onClose}

            maxWidth="lg"

            fullWidth

        >

            <DialogTitle>

                {

                    purchaseOrder

                        ? "Edit Purchase Order"

                        : "Create Purchase Order"

                }

            </DialogTitle>

            <DialogContent>

                <Grid

                    container

                    spacing={2}

                    sx={{ mt: 1 }}

                >

                    <Grid item xs={12} md={6}>

                        <TextField

                            select

                            fullWidth

                            label="Vendor"

                            name="vendorId"

                            value={form.vendorId}

                            onChange={handleChange}

                        >

                            {

                                vendors.map(vendor => (

                                    <MenuItem

                                        key={vendor.id}

                                        value={vendor.id}

                                    >

                                        {vendor.name}

                                    </MenuItem>

                                ))

                            }

                        </TextField>

                    </Grid>

                    <Grid item xs={12} md={3}>

                        <TextField

                            fullWidth

                            type="date"

                            label="Order Date"

                            name="orderDate"

                            value={form.orderDate}

                            onChange={handleChange}

                            InputLabelProps={{

                                shrink: true

                            }}

                        />

                    </Grid>

                    <Grid item xs={12} md={3}>

                        <TextField

                            fullWidth

                            type="date"

                            label="Expected Delivery"

                            name="expectedDelivery"

                            value={form.expectedDelivery}

                            onChange={handleChange}

                            InputLabelProps={{

                                shrink: true

                            }}

                        />

                    </Grid>

                    <Grid item xs={12}>

                        <TextField

                            fullWidth

                            multiline

                            rows={3}

                            label="Remarks"

                            name="remarks"

                            value={form.remarks}

                            onChange={handleChange}

                        />

                    </Grid>

                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography

                    variant="h6"

                    gutterBottom

                >

                    Purchase Items

                </Typography>
                <TableContainer
    component={Paper}
    variant="outlined"
>

    <Table>

        <TableHead>

            <TableRow>

                <TableCell width="30%">
                    Asset Name
                </TableCell>

                <TableCell width="25%">
                    Category
                </TableCell>

                <TableCell width="10%">
                    Qty
                </TableCell>

                <TableCell width="15%">
                    Unit Price
                </TableCell>

                <TableCell width="15%">
                    Total
                </TableCell>

                <TableCell width="5%">
                </TableCell>

            </TableRow>

        </TableHead>

        <TableBody>

            {

                form.items.map((item, index) => (

                    <TableRow key={index}>

                        <TableCell>

                            <TextField

                                fullWidth

                                value={item.assetName}

                                onChange={(e) =>
                                    handleItemChange(
                                        index,
                                        "assetName",
                                        e.target.value
                                    )
                                }

                            />

                        </TableCell>

                        <TableCell>

                            <TextField

                                select

                                fullWidth

                                value={item.categoryId}

                                onChange={(e) =>
                                    handleItemChange(
                                        index,
                                        "categoryId",
                                        e.target.value
                                    )
                                }

                            >

                                {

                                    categories.map(category => (

                                        <MenuItem

                                            key={category.id}

                                            value={category.id}

                                        >

                                            {category.name}

                                        </MenuItem>

                                    ))

                                }

                            </TextField>

                        </TableCell>

                        <TableCell>

                            <TextField

                                type="number"

                                fullWidth

                                value={item.quantity}

                                onChange={(e) =>
                                    handleItemChange(
                                        index,
                                        "quantity",
                                        e.target.value
                                    )
                                }

                            />

                        </TableCell>

                        <TableCell>

                            <TextField

                                type="number"

                                fullWidth

                                value={item.unitPrice}

                                onChange={(e) =>
                                    handleItemChange(
                                        index,
                                        "unitPrice",
                                        e.target.value
                                    )
                                }

                            />

                        </TableCell>

                        <TableCell>

                            ₹

                            {

                                (
                                    Number(item.quantity || 0) *

                                    Number(item.unitPrice || 0)

                                ).toLocaleString()

                            }

                        </TableCell>

                        <TableCell>

                            <IconButton

                                color="error"

                                onClick={() =>
                                    removeRow(index)
                                }

                                disabled={
                                    form.items.length === 1
                                }

                            >

                                <DeleteIcon />

                            </IconButton>

                        </TableCell>

                    </TableRow>

                ))

            }

        </TableBody>

    </Table>

</TableContainer>

<Button

    sx={{ mt: 2 }}

    startIcon={<AddIcon />}

    variant="outlined"

    onClick={addRow}

>

    Add Item

</Button>

<Divider sx={{ my: 3 }} />

<Grid container>

    <Grid item xs={12}>

        <Typography

            variant="h5"

            fontWeight="bold"

            align="right"

        >

            Grand Total :

            ₹ {grandTotal.toLocaleString()}

        </Typography>

    </Grid>

</Grid>

</DialogContent>

<DialogActions>

    <Button

        color="inherit"

        onClick={onClose}

    >

        Cancel

    </Button>

    <Button

        variant="contained"

        onClick={handleSave}

    >

        {

            purchaseOrder

                ? "Update PO"

                : "Create PO"

        }

    </Button>

</DialogActions>

</Dialog>

);

}