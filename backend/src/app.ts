import express from 'express';
import cors from 'cors';
import router from './routes';
import prisma from './prisma/client';
import session from 'express-session';
import passport from './config/passportConfig';

const app = express();
const PORT = 3000;

// Configure CORS to allow requests from Angular frontend
app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
