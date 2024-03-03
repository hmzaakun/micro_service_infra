import express from 'express';
import authRoutes from './authController';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Utilisation des routes d'authentification
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
