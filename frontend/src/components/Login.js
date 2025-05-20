import React, { useState } from "react";
import axios from "../api/axios";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/login", form);
      // Сохраняем токен (например, в localStorage)
      localStorage.setItem("token", res.data.token);
      navigate("/properties");
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка входа");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Вход</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email или телефон" name="login" autoComplete="current-login" value={form.login} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Пароль" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Войти</Button>
      </form>
    </Box>
  );
};

export default Login;
