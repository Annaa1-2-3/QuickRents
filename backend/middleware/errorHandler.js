module.exports = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: err.details
      });
    }
  
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
  };

  