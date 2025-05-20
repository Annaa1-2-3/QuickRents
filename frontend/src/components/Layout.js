// src/components/Layout.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App'; 
import Footer from './Footer';

function Layout({ children }) {
  const { token, logout } = useContext(AuthContext);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}
          >
            QuickRents
          </Typography>
          {/* Ссылка на создание объявления только для авторизованных */}
          {token && (
            <Button color="inherit" component={Link} to="/create">
              Добавить объявление
            </Button>
          )}
          {/* Кнопки входа/выхода */}
          {token ? (
            <Button color="inherit" onClick={logout}>
              Выйти
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Вход
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Регистрация
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        {children}
      </Container>
      <Footer /> {}
    </div>
  );
}

export default Layout;
