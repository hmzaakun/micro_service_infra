import { authenticateToken } from './authMiddleware';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "L'utilisateur ne peut pas être créé" });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Utilisateur non trouvé" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Mot de passe incorrect" });
      }
      
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      // Génération du JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Erreur de connexion" });
    }
  });

  router.patch('/update', authenticateToken, async (req, res) => {
    const { name } = req.body;
    const userId = req.user?.userId;
  
    if (!userId) return res.sendStatus(404);
  
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
  });

export default router;
