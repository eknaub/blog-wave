import express from 'express';
import cors from 'cors';
import router from './routes';
import prisma from './prisma/client';
import passport from './config/passportConfig';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swaggerConfig';
import { apiLimiter } from './config/rateLimitConfig';

const app = express();
const PORT = 3000;

// Configure CORS to allow requests from Angular frontend
app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);

//Configure Swagger UI
app.get('/api-docs/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Apply api rate limiting
app.use('/api', apiLimiter);

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`);
});
