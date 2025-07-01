import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const PORT = 3000;

// Configure CORS to allow requests from Angular frontend
app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
