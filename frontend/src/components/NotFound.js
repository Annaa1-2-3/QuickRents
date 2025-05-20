import React from "react";
import { Typography, Box } from "@mui/material";

const NotFound = () => (
  <Box mt={4} textAlign="center">
    <Typography variant="h3" color="error">404</Typography>
    <Typography variant="h5">Страница не найдена</Typography>
  </Box>
);

export default NotFound;
