const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB_URI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB_URI).then(() => console.log('DB connection successful'));

//Start Server
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on http://127.0.0.1:${port}...`);
});

// Handle Promise Rejections
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
