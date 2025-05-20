const userService = require('../services/userService');

class UserController {
  async getAllUsers(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещен: требуются права администратора' });
      }
      
      const users = await userService.getAllUsers();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Доступ запрещен' });
      }
      
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Доступ запрещен' });
      }
      
      if (userData.role && req.user.role !== 'admin') {
        delete userData.role;
      }
      
      const updatedUser = await userService.updateUser(id, userData);
      if (!updatedUser) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      
      res.json({
        message: 'Данные пользователя обновлены',
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Доступ запрещен' });
      }
      
      const result = await userService.deleteUser(id);
      if (!result) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      
      res.json({ message: 'Пользователь удален' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async getUserBookings(req, res) {
    try {
      const userId = req.user.id;
      
      const bookings = await userService.getUserBookings(userId);
      res.json({ bookings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async getUserReviews(req, res) {
    try {
      const userId = req.user.id;
      
      const reviews = await userService.getUserReviews(userId);
      res.json({ reviews });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserProperties(req, res) {
    try {
      const userId = req.user.id;
      const properties = await userService.getOwnerProperties(userId);
      res.json({ properties });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOwnerBookings(req, res) {
    try {
      const userId = req.user.id;
      const bookings = await userService.getOwnerBookings(userId);
      res.json({ bookings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      const updatedBooking = await userService.updateBookingStatus(id, status, userId);
      res.json({ booking: updatedBooking });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();