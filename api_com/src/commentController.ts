import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Route pour créer un commentaire
router.post('/comments', async (req, res) => {
  const { content, postId, userId, userName } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: { content, postId, userId, userName },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du commentaire" });
  }
});

// Route pour récupérer tous les commentaires d'un post
router.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
  }
});

export default router;
