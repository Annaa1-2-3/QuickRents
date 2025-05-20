import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PropertyList from './components/PropertyList';
import PropertyDetails from './components/PropertyDetails';
import PropertyCreate from './components/PropertyCreate';
import NotFound from './components/NotFound';

// --- Контекст авторизации ---
export const AuthContext = createContext();

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  // Проверка токена при запуске приложения
  useEffect(() => {
    if (token) {
      // запрос к backend для получения информации о пользователе
      // Пример:
      // axios.get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      //   .then(res => setUser(res.data.user))
      //   .catch(() => setUser(null));
    }
  }, [token]);

  // Функция выхода
  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  // Защищенный маршрут
  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            {/* Защищенный маршрут для создания объявления */}
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <PropertyCreate />
                </PrivateRoute>
              }
            />
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

