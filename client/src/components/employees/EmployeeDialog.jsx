import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";

import { useEffect, useState } from "react";

export default function EmployeeDialog({

    open,
    onClose,
    onSave,
    employee,
    departments = [],

}) {

    const [form, setForm] = useState({

        name: "",
        email: "",
        phone: "",
        designation: "",
        departmentId: "",

    });

    useEffect(() => {

        if (employee) {

            setForm({

                firstName: employee?.firstName || "",
                lastName: employee?.lastName  || "",
                email: employee.email || "",
                phone: employee.phone || "",
                designation: employee.designation || "",
                departmentId:
                    employee.departmentId || "",

            });

        }

        else {

            setForm({

                name: "",
                email: "",
                phone: "",
                designation: "",
                departmentId: "",

            });

        }

    }, [employee]);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value,

        });

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>

                {employee
                    ? "Edit Employee"
                    : "Add Employee"}

            </DialogTitle>

            <DialogContent>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Employee Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Designation"
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                />

                <TextField
                    select
                    fullWidth
                    margin="normal"
                    label="Department"
                    name="departmentId"
                    value={form.departmentId}
                    onChange={handleChange}
                >

                    {departments.map((dept) => (

                        <MenuItem
                            key={dept.id}
                            value={dept.id}
                        >
                            {dept.name}
                        </MenuItem>

                    ))}

                </TextField>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={() =>
                        onSave(form)
                    }
                >
                    Save
                </Button>

            </DialogActions>

        </Dialog>

    );

}