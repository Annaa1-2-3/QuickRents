const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validateUser } = require('../middleware/validationMiddleware');

class AuthController {
  async register(req, res) {
    try {
      const userData = req.body;
      
      const validationErrors = validateUser(userData);
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
      
      if (userData.password !== userData.confirmPassword) {
        return res.status(400).json({ error: 'Пароли не совпадают' });
      }
      
      const user = await User.create(userData);
      
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        message: 'Пользователь успешно зарегистрирован',
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  async login(req, res) {
    try {
      const { login, password } = req.body;
      
      if (!login || !password) {
        return res.status(400).json({ error: 'Требуется указать email/телефон и пароль' });
      }
      
      let user;
      if (login.includes('@')) {
        user = await User.findByEmail(login);
      } else {
        user = await User.findByPhone(login);
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Неверные учетные данные' });
      }
      
      const isPasswordValid = await User.comparePasswords(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Неверные учетные данные' });
      }
      
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );
      
      res.json({
        message: 'Вход выполнен успешно',
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Требуется указать email' });
      }
      
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(200).json({ message: 'Если этот email зарегистрирован, инструкции по сбросу пароля будут отправлены' });
      }
      
      const resetToken = jwt.sign(
        { id: user.id },
        process.env.JWT_RESET_SECRET || 'your_reset_secret',
        { expiresIn: '1h' }
      );
      
      res.json({
        message: 'Инструкции по сбросу пароля отправлены',
        resetToken
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async resetPassword(req, res) {
    try {
      const { token, newPassword, confirmPassword } = req.body;
      
      if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'Все поля обязательны' });
      }
      
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'Пароли не совпадают' });
      }
      
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_RESET_SECRET || 'your_reset_secret');
      } catch (err) {
        return res.status(401).json({ error: 'Недействительный или просроченный токен' });
      }
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      const query = 'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2';
      await db.query(query, [hashedPassword, user.id]);
      
      res.json({ message: 'Пароль успешно обновлен' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();