// src/components/Footer.js
import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: 6,
      py: 3,
      px: 2,
      backgroundColor: "#1976d2",
      color: "white",
      textAlign: "center",
      width: "100%"
    }}
  >
    <Typography variant="body1">
      © {new Date().getFullYear()} QuickRents. Все права защищены.
    </Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>
      Разработчики для связи:{" "}
      <Link
        href="mailto:annaku22uc2.2@gmail.com"
        color="inherit"
        underline="always"
      >
        annaku22uc2.2@gmail.com
      </Link>
      {" | "}
      <Link
        href="https://t.me/yourtelegram"
        color="inherit"
        underline="always"
        target="_blank"
        rel="noopener"
      >
        Telegram
      </Link>
    </Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>
      По вопросам сотрудничества и предложений по работе - пишите нам!
    </Typography>
  </Box>
);

export default Footer;
