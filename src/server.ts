import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { Server } from 'http';

process.on('uncaughtException', () => {
  process.exit(1);
});

let server: Server;
const port = config.port;
async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);

    console.log(`🗄️ database is connected succesfully`);

    server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.log('Failed to connect database', err);
  }

  process.on('unhandledRejection', () => {
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
bootstrap();

process.on('SIGTERM', () => {
  console.log('sigterm received');
  if (server) {
    server.close();
  }
});
