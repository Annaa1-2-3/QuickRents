const userService = require('../services/userService');
const postService = require('../services/postService');
const db = require('../db');

class AdminController {
  async getDashboardStats(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещен' });
      }
      
      const usersQuery = 'SELECT COUNT(*) as total_users FROM users';
      const usersResult = await db.query(usersQuery);
    
      const propertiesQuery = 'SELECT COUNT(*) as total_properties FROM properties';
      const propertiesResult = await db.query(propertiesQuery);
      
      const bookingsQuery = 'SELECT COUNT(*) as total_bookings FROM bookings';
      const bookingsResult = await db.query(bookingsQuery);
      
      const rolesQuery = `
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role
      `;
      const rolesResult = await db.query(rolesQuery);
      
      const regionsQuery = `
        SELECT region, COUNT(*) as count 
        FROM properties 
        GROUP BY region 
        ORDER BY count DESC 
        LIMIT 10
      `;
      const regionsResult = await db.query(regionsQuery);
      
      const recentUsersQuery = `
        SELECT id, email, phone, first_name, last_name, role, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 5
      `;
      const recentUsersResult = await db.query(recentUsersQuery);
      
      const recentBookingsQuery = `
        SELECT b.id, b.check_in_date, b.check_out_date, b.status, b.total_price,
               p.title as property_title, p.city,
               u.first_name as user_first_name, u.last_name as user_last_name
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users u ON b.user_id = u.id
        ORDER BY b.created_at DESC
        LIMIT 5
      `;
      const recentBookingsResult = await db.query(recentBookingsQuery);
      
      res.json({
        stats: {
          users: usersResult.rows[0].total_users,
          properties: propertiesResult.rows[0].total_properties,
          bookings: bookingsResult.rows[0].total_bookings
        },
        userRoles: rolesResult.rows,
        topRegions: regionsResult.rows,
        recentUsers: recentUsersResult.rows,
        recentBookings: recentBookingsResult.rows
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async manageUsers(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещен' });
      }
      
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const query = `
        SELECT id, email, phone, first_name, last_name, role, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const countQuery = 'SELECT COUNT(*) FROM users';
      
      const [result, countResult] = await Promise.all([
        db.query(query, [limit, offset]),
        db.query(countQuery)
      ]);
      
      const totalUsers = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalUsers / limit);
      
      res.json({
        users: result.rows,
        pagination: {
          total: totalUsers,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async manageListings(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещен' });
      }
      
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const query = `
        SELECT p.*, u.first_name as owner_first_name, u.last_name as owner_last_name
        FROM properties p
        JOIN users u ON p.owner_id = u.id
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const countQuery = 'SELECT COUNT(*) FROM properties';
      
      const [result, countResult] = await Promise.all([
        db.query(query, [limit, offset]),
        db.query(countQuery)
      ]);
      
      const totalListings = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalListings / limit);
      
      res.json({
        listings: result.rows,
        pagination: {
          total: totalListings,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async manageEvents(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещен' });
      }
      
      const { action } = req.query;
      
      if (action === 'create' && req.method === 'POST') {
        const eventData = req.body;
        const newEvent = await postService.createEvent(eventData);
        return res.status(201).json({
          message: 'Событие успешно создано',
          event: newEvent
        });
      }
      
      if (action === 'update' && req.method === 'PUT') {
        const { id } = req.params;
        const eventData = req.body;
        const updatedEvent = await postService.updateEvent(id, eventData);
        
        if (!updatedEvent) {
          return res.status(404).json({ error: 'Событие не найдено' });
        }
        
        return res.json({
          message: 'Событие обновлено',
          event: updatedEvent
        });
      }
      
      if (action === 'delete' && req.method === 'DELETE') {
        const { id } = req.params;
        const result = await postService.deleteEvent(id);
        
        if (!result) {
          return res.status(404).json({ error: 'Событие не найдено' });
        }
        
        return res.json({ message: 'Событие удалено' });
      }
      
      const events = await postService.getAllEvents();
      res.json({ events });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async manageReviews(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещен' });
      }
      
      const { action } = req.query;
      
      if (action === 'delete' && req.method === 'DELETE') {
        const { id } = req.params;
        
        const deleteQuery = 'DELETE FROM reviews WHERE id = $1 RETURNING id';
        const result = await db.query(deleteQuery, [id]);
        
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Отзыв не найден' });
        }
        
        return res.json({ message: 'Отзыв удален' });
      }
      
      const query = `
        SELECT r.*, 
               p.title as property_title, p.city,
               u.first_name as user_first_name, u.last_name as user_last_name
        FROM reviews r
        JOIN properties p ON r.property_id = p.id
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
      `;
      
      const result = await db.query(query);
      res.json({ reviews: result.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AdminController();