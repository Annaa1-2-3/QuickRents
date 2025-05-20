import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ruLocale from "date-fns/locale/ru";

const PropertySearch = () => {
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState([]);
  const [showChildrenDialog, setShowChildrenDialog] = useState(false);
  const [pets, setPets] = useState(false);
  const navigate = useNavigate();

  // Добавление ребенка
  const handleAddChild = () => {
    setChildren([...children, { age: "" }]);
  };
  // Удаление ребенка
  const handleRemoveChild = (idx) => {
    setChildren(children.filter((_, i) => i !== idx));
  };
  // Изменение возраста ребенка
  const handleChildAgeChange = (idx, value) => {
    setChildren(children.map((child, i) => (i === idx ? { age: value } : child)));
  };

  // Формируем параметры поиска
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (checkIn) params.append("checkIn", checkIn.toISOString().split("T")[0]);
    if (checkOut) params.append("checkOut", checkOut.toISOString().split("T")[0]);
    params.append("adults", adults);
    if (children.length > 0) params.append("children", children.map(c => c.age).join(","));
    if (pets) params.append("pets", "true");
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <Box my={3}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
        <Grid container spacing={2} columns={12} alignItems="center">
          {/* Город */}
          <Grid span={3}>
            <TextField
              label="Город"
              value={city}
              onChange={e => setCity(e.target.value)}
              fullWidth
              autoComplete="address-level2"
            />
          </Grid>
          {/* Заезд */}
          <Grid span={2}>
            <DatePicker
              label="Заезд"
              value={checkIn}
              onChange={setCheckIn}
              minDate={new Date()}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          {/* Выезд */}
          <Grid span={2}>
            <DatePicker
              label="Выезд"
              value={checkOut}
              onChange={setCheckOut}
              minDate={checkIn || new Date()}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          {/* Взрослые */}
          <Grid span={2}>
            <TextField
              label="Взрослые"
              type="number"
              value={adults}
              onChange={e => setAdults(Math.max(1, Number(e.target.value)))}
              fullWidth
              inputProps={{ min: 1, max: 100 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setAdults(Math.max(1, adults - 1))}><RemoveIcon /></IconButton>
                    <IconButton onClick={() => setAdults(Math.min(100, adults + 1))}><AddIcon /></IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          {/* Дети */}
          <Grid span={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setShowChildrenDialog(true)}
            >
              Дети: {children.length}
            </Button>
            <Dialog open={showChildrenDialog} onClose={() => setShowChildrenDialog(false)}>
              <DialogTitle>Дети (0-17 лет)</DialogTitle>
              <DialogContent>
                {children.map((child, idx) => (
                  <Box key={idx} display="flex" alignItems="center" mb={1}>
                    <TextField
                      label={`Возраст ребенка #${idx + 1}`}
                      type="number"
                      value={child.age}
                      onChange={e => handleChildAgeChange(idx, e.target.value)}
                      inputProps={{ min: 0, max: 17 }}
                      sx={{ mr: 1 }}
                    />
                    <IconButton onClick={() => handleRemoveChild(idx)}><RemoveIcon /></IconButton>
                  </Box>
                ))}
                <Button
                  onClick={handleAddChild}
                  startIcon={<AddIcon />}
                  disabled={children.length >= 10}
                  sx={{ mt: 1 }}
                >
                  Добавить ребенка
                </Button>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowChildrenDialog(false)}>Готово</Button>
              </DialogActions>
            </Dialog>
          </Grid>
          {/* Питомцы */}
          <Grid span={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={pets}
                  onChange={e => setPets(e.target.checked)}
                  color="primary"
                />
              }
              label="С питомцами"
            />
          </Grid>
          {/* Кнопка поиска */}
          <Grid span={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
              size="large"
            >
              Найти жильё
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default PropertySearch;
