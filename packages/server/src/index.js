import app from './app';
import 'colors';

const { PORT = 3000 } = process.env;
const server = app.listen(PORT, () =>
  console.log(`Running server on port: ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
