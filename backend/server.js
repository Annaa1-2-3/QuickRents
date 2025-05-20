// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { setup } = require('./db/setup');
const adminRouter = require('./Routes/adminRouter');
const postRouter = require('./Routes/postRouter');
const userRouter = require('./Routes/userRouter');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/admin', adminRouter);
app.use('/api/properties', postRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);


const initDb = async () => {
  try {
    await setup();
    console.log('Database initialized successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

initDb();
