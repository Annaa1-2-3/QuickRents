const validateUser = (userData) => {
    const errors = [];
    
    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push('Valid email is required');
    }
    
    if (!userData.phone || !/^\+?[0-9]{10,15}$/.test(userData.phone)) {
      errors.push('Valid phone number is required');
    }
    
    if (!userData.first_name || userData.first_name.length < 2) {
      errors.push('First name is required (minimum 2 characters)');
    }
    
    if (!userData.last_name || userData.last_name.length < 2) {
      errors.push('Last name is required (minimum 2 characters)');
    }
    
    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    if (userData.role && !['owner', 'tenant', 'admin', 'guest'].includes(userData.role)) {
      errors.push('Invalid role');
    }
    
    return errors;
  };
  
  const validateProperty = (propertyData) => {
    const errors = [];
    
    if (!propertyData.title || propertyData.title.length < 5) {
      errors.push('Title is required (minimum 5 characters)');
    }
    
    if (!propertyData.description || propertyData.description.length < 20) {
      errors.push('Description is required (minimum 20 characters)');
    }
    
    if (!propertyData.address) {
      errors.push('Address is required');
    }
    
    if (!propertyData.city) {
      errors.push('City is required');
    }
    
    if (!propertyData.price_per_night || propertyData.price_per_night <= 0) {
      errors.push('Valid price per night is required');
    }
    
    if (!propertyData.bedrooms || propertyData.bedrooms <= 0) {
      errors.push('Number of bedrooms is required');
    }
    
    if (!propertyData.max_guests || propertyData.max_guests <= 0) {
      errors.push('Maximum number of guests is required');
    }
    
    return errors;
  };
  
  module.exports = {
    validateUser,
    validateProperty
  };