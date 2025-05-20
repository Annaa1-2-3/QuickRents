import React, { useState } from "react";
import axios from "../api/axios";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    try {
      await axios.post("/users/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка регистрации");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Регистрация</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" name="email" autoComplete="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Телефон" name="phone" autoComplete="tel" value={form.phone} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Имя" name="first_name" autoComplete="given-name" value={form.first_name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Фамилия" name="last_name" autoComplete="family-name" value={form.last_name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Пароль" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Подтвердите пароль" name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} fullWidth margin="normal" required />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Зарегистрироваться</Button>
      </form>
    </Box>
  );
};

export default Register;
