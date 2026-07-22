import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {

        primary: {
            main: "#1976d2",
        },

        secondary: {
            main: "#00acc1",
        },

        background: {
            default: "#f4f6f9",
        },

    },

    typography: {

        fontFamily: "Segoe UI, sans-serif",

        h4: {
            fontWeight: 700,
        },

    },

});

export default theme;