import { join } from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDB } from './config/database';
import pkg from '../package.json';
import auth from './routes/auth.routes';
import users from './routes/users.routes';
import render from './routes/render.routes';

// Load env vars
config({
  path: join(__dirname, 'config', '.env')
});

// Connect to DB
connectDB();

const { name, version, description, author } = pkg;
const app = express();

// Middlewares
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');

// Cookie parser
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.get('/about', (req, res) =>
  res.json({
    message: 'Welcome to the User Management API',
    name,
    version,
    description,
    author
  })
);
app.use('*', render);

export default app;
