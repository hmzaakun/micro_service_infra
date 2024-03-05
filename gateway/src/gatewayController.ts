import express from 'express';
import axios from 'axios';

const router = express.Router();

const AUTH_SERVICE_URL = 'http://host.docker.internal:3000/api/auth';
const POST_SERVICE_URL = 'http://host.docker.internal:3001';
const COM_SERVICE_URL = 'http://host.docker.internal:3002';

// Helper pour faire des requêtes à l'API d'authentification
const authRequest = axios.create({
  baseURL: AUTH_SERVICE_URL,
});

const verifyToken = async (token: string) => {
  try {
    await authRequest.post('/verifyToken', { token });
    return true;
  } catch (error) {
    return false;
  }
};

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
        res.status(500).json({ error: error.message});
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
    try {
      const postResponse = await axios.post(`${POST_SERVICE_URL}`+'/posts', {
        title: req.body.title,
        content: req.body.content,
        userId: userInfo.id,
        userName: userInfo.name,
    }, {
        headers: { Authorization: token },
    });
    res.json(postResponse.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message , userInfo: userInfo});
  }
} catch (error: any) {
    res.status(500).json({ error: error.message });
}
});

// Récupérer tous les posts (nécessite une vérification de token)
router.get('/posts', async (req, res) => {
  const token = req.headers.authorization ?? '';
  const verif = await verifyToken(token);
  if (verif == null) return res.sendStatus(401);

  try {
    const postsResponse = await axios.get(`${POST_SERVICE_URL}/posts`, {
      headers: { Authorization: token },
    });
    res.json(postsResponse.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mise à jour d'un post (nécessite une vérification de token)
router.patch('/posts/:id', async (req, res) => {
  const token = req.headers.authorization ?? '';
  const { id } = req.params;
  const verif = await verifyToken(token);
  if (verif == null) return res.sendStatus(401);

  try {
    const updateResponse = await axios.patch(`${POST_SERVICE_URL}/posts/${id}`, req.body, {
      headers: { Authorization: token },
    });
    res.json(updateResponse.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Poster un commentaire
router.post('/comments', async (req, res) => {
  const token = req.headers.authorization ?? '';
  try {
    const userInfo = await getUserInfo(token.split(' ')[1]);
    const commentResponse = await axios.post(`${COM_SERVICE_URL}/comments`, {
      content: req.body.content,
      postId: req.body.postId,
      userId: userInfo.id,
      userName: userInfo.name,
    }, {
      headers: { Authorization: token },
    });
    res.json(commentResponse.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer tous les commentaires d'un post
router.get('/comments/:postId', async (req, res) => {
  const token = req.headers.authorization ?? '';
  const verif = await verifyToken(token);
  if (verif == null) return res.sendStatus(401);

  const { postId } = req.params;
  try {
    const commentsResponse = await axios.get(`${COM_SERVICE_URL}/comments/${postId}`, {
      headers: { Authorization: token },
    });
    res.json(commentsResponse.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});



export default router;
