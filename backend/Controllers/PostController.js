const postService = require('../services/postService');
const { validateProperty } = require('../middleware/validationMiddleware');

class PostController {
  async createPost(req, res) {
    try {
      const propertyData = req.body;
      propertyData.owner_id = req.user.id;
      
      if (req.user.role !== 'owner' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Только владельцы жилья могут создавать объявления' });
      }
      
      const validationErrors = validateProperty(propertyData);
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
      
      const newProperty = await postService.createProperty(propertyData);
      
      res.status(201).json({
        message: 'Объявление успешно создано',
        property: newProperty
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async getAllPosts(req, res) {
    try {
      const filters = req.query;
      const properties = await postService.getAllProperties(filters);
      
      res.json({ properties });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async getPostById(req, res) {
    try {
      const { id } = req.params;
      
      const property = await postService.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ error: 'Объявление не найдено' });
      }
      
      res.json({ property });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const propertyData = req.body;
      
      const property = await postService.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ error: 'Объявление не найдено' });
      }
      
      if (property.owner_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Только владелец может обновить это объявление' });
      }
      
      const updatedProperty = await postService.updateProperty(id, propertyData);
      
      res.json({
        message: 'Объявление обновлено',
        property: updatedProperty
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      
      const property = await postService.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ error: 'Объявление не найдено' });
      }
      
      if (property.owner_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Только владелец может удалить это объявление' });
      }
      
      await postService.deleteProperty(id);
      
      res.json({ message: 'Объявление удалено' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async searchPosts(req, res) {
    try {
      const searchParams = req.query;
      
      const properties = await postService.searchProperties(searchParams);
      
      res.json({ properties });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async addReview(req, res) {
    try {
      const { propertyId } = req.params;
      const reviewData = req.body;
      reviewData.user_id = req.user.id;
      reviewData.property_id = propertyId;
      
      const property = await postService.getPropertyById(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Объявление не найдено' });
      }
      
      const hasBooking = await postService.checkUserBooking(req.user.id, propertyId);
      if (!hasBooking && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Вы можете оставлять отзывы только о жилье, которое бронировали' });
      }
      
      const review = await postService.addReview(reviewData);
      
      res.status(201).json({
        message: 'Отзыв добавлен',
        review
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async getPropertyReviews(req, res) {
    try {
      const { propertyId } = req.params;
      
      const reviews = await postService.getPropertyReviews(propertyId);
      
      res.json({ reviews });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async bookProperty(req, res) {
    try {
      const { propertyId } = req.params;
      const bookingData = req.body;
      bookingData.property_id = propertyId;
      bookingData.user_id = req.user.id;
      
      const property = await postService.getPropertyById(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Объявление не найдено' });
      }
      
      if (!bookingData.check_in_date || !bookingData.check_out_date) {
        return res.status(400).json({ error: 'Требуется указать даты заезда и отъезда' });
      }
      
      const checkIn = new Date(bookingData.check_in_date);
      const checkOut = new Date(bookingData.check_out_date);
      
      if (checkIn >= checkOut) {
        return res.status(400).json({ error: 'Дата отъезда должна быть позже даты заезда' });
      }
      
      const isAvailable = await postService.checkAvailability(propertyId, checkIn, checkOut);
      if (!isAvailable) {
        return res.status(400).json({ error: 'Жилье недоступно на выбранные даты' });
      }
      
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      bookingData.total_price = property.price_per_night * nights;
      
      const booking = await postService.createBooking(bookingData);
      
      res.status(201).json({
        message: 'Бронирование создано',
        booking
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

async getEvents(req, res) {
  try {
    const { region } = req.query;
    
    let events;
    if (region) {
      events = await postService.getEventsByRegion(region);
    } else {
      events = await postService.getAllEvents();
    }
    
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async getUpcomingEvents(req, res) {
  try {
    const { limit } = req.query;
    const events = await postService.getUpcomingEvents(limit || 5);
    
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async getEventById(req, res) {
  try {
    const { id } = req.params;
    
    const event = await postService.getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }
    
    res.json({ event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

}
module.exports = new PostController();

