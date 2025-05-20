import React, { useState } from "react";
import axios from "../api/axios";
import { TextField, Button, Typography, Box } from "@mui/material";

const PropertyCreate = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    region: "",
    price_per_night: "",
    bedrooms: "",
    bathrooms: "",
    max_guests: "",
    pets_allowed: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // Добавьте авторизацию, если требуется (например, токен)
      await axios.post("/properties", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setSuccess("Объявление успешно создано!");
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка создания");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Добавить объявление</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Название" name="title" value={form.title} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Описание" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Адрес" name="address" value={form.address} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Город" name="city" value={form.city} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Регион" name="region" value={form.region} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Цена за ночь" name="price_per_night" type="number" value={form.price_per_night} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Спален" name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Ванных" name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Макс. гостей" name="max_guests" type="number" value={form.max_guests} onChange={handleChange} fullWidth margin="normal" required />
        <label>
          <input type="checkbox" name="pets_allowed" checked={form.pets_allowed} onChange={handleChange} />
          Можно с питомцами
        </label>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Создать</Button>
      </form>
    </Box>
  );
};

export default PropertyCreate;
