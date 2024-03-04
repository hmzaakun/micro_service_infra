import express from 'express';
import gatewayRouter from './gatewayController'; // Assurez-vous que le chemin est correct

const app = express();
const PORT = process.env.PORT || 4000; // Port par défaut pour la Gateway

// Middleware pour analyser les corps de requête JSON
app.use(express.json());

// Utilisation du routeur de la Gateway pour toutes les routes
app.use(gatewayRouter);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`API Gateway running on port :${PORT}`);
});
