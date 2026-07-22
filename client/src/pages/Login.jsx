import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/auth.service";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      localStorage.setItem("token", response.data.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#1565c0,#42a5f5)",
      }}
    >
      <Paper
  elevation={12}
  sx={{
    width: 550,
    p: 5,
    borderRadius: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
        <Box
  display="flex"
  justifyContent="center"
  mb={3}
>
  <Inventory2RoundedIcon
    sx={{
      fontSize: 80,
      color: "#1976d2",
    }}
  />
</Box>

        <Typography
    variant="h4"
    fontWeight="bold"
    align="center"
>
    Software Asset Tracking
</Typography>

        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          
        </Typography>

        <Typography
    align="center"
    color="text.secondary"
    mb={4}
>
    Welcome Back
</Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
  fullWidth
  variant="contained"
  size="large"
  onClick={handleLogin}
  disabled={loading}
  sx={{
    mt: 3,
    py: 1.5,
    fontWeight: "bold",
    borderRadius: 2,
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: 6,
    },
  }}
>
  {loading ? (
    <CircularProgress size={24} color="inherit" />
  ) : (
    "LOGIN"
  )}
</Button>

        <Typography
          textAlign="center"
          mt={4}
          color="gray"
          fontSize={13}
        >
          © 2026 Asset Management System
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;