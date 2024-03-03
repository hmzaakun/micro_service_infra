import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

// Route pour créer un post
router.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await prisma.post.create({
      data: { title, content },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du post" });
  }
});

// Route pour récupérer tous les posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des posts" });
  }
});

// Route pour mettre à jour un post (exemple avec le titre)
router.patch('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du post" });
  }
});

export default router;
