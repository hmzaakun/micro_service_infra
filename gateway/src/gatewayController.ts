import express from 'express';
import axios from 'axios';

const router = express.Router();

const AUTH_SERVICE_URL = 'http://api_auth:3000/api';
const POST_SERVICE_URL = 'http://api_post:3001/posts';

// Helper pour faire des requêtes à l'API d'authentification
const authRequest = axios.create({
  baseURL: AUTH_SERVICE_URL,
});

// Helper pour récupérer les informations de l'utilisateur à partir du JWT
const getUserInfo = async (token: string) => {
  const response = await authRequest.get('/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Inscription
router.post('/signup', async (req, res) => {
    try {
        const response = await authRequest.post('/signup', req.body);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const response = await authRequest.post('/login', req.body);
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mise à jour du nom d'utilisateur
router.patch('/update', async (req, res) => {
  const token = req.headers.authorization;
  try {
    const response = await authRequest.patch('/update', req.body, {
      headers: { Authorization: token },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  const token = req.headers.authorization;
  try {
    const response = await authRequest.get('/users', {
      headers: { Authorization: token },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer le profil de l'utilisateur connecté
router.get('/me', async (req, res) => {
  const token = req.headers.authorization;
  try {
    const response = await authRequest.get('/me', {
      headers: { Authorization: token },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Poster un nouveau post
router.post('/posts', async (req, res) => {
const token = req.headers.authorization ?? '';
try {
    const userInfo = await getUserInfo(token.split(' ')[1]);
    const postResponse = await axios.post(`${POST_SERVICE_URL}`, {
        title: req.body.title,
        content: req.body.content,
        userId: userInfo.id,
        userName: userInfo.name,
    }, {
        headers: { Authorization: token },
    });
    res.json(postResponse.data);
} catch (error: any) {
    res.status(500).json({ error: error.message });
}
});

// Ajoutez d'autres routes pour `post` et `com` en suivant la logique ci-dessus

export default router;
