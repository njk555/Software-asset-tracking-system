import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <AppBar position="fixed">

      <Toolbar>

        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
          Software Asset Tracking System
        </Typography>

        <Box
          display="flex"
          gap={3}
          alignItems="center"
        >

          <Typography>
            {user?.fullName}
          </Typography>

          <Button
            color="inherit"
            onClick={logout}
          >
            Logout
          </Button>

        </Box>

      </Toolbar>

    </AppBar>

  );

}

export default Navbar;