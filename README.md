# Projet de Microservices avec API Gateway 🚀

Ce projet illustre la mise en place d'une architecture de microservices comprenant une API Gateway. Cette architecture permet de gérer l'authentification, la création et la gestion des posts ainsi que des commentaires dans un forum.

## Comment Lancer le Projet avec Docker 🐳

Pour lancer le projet à l'aide de Docker, suivez ces étapes détaillées :

1. **Prérequis** : Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine.
2. **Clonage du projet** : Clonez le dépôt Git du projet sur votre machine locale.
3. **Configuration** : Accédez au répertoire racine du projet cloné. Si nécessaire, ajustez les fichiers de configuration (par exemple, `.env` pour les variables d'environnement).
4. **Lancement des services** : Ouvrez un terminal dans le répertoire racine du projet et exécutez la commande suivante pour construire et démarrer tous les services définis dans votre fichier `docker-compose.yml` :

```bash
docker-compose up
```

Cette commande va démarrer tous les services (bases de données, API Auth, API Post, API Comment, et API Gateway) et les rendre accessibles via les ports configurés.

## Routes Disponibles via la Gateway 🛣️

La Gateway expose les routes suivantes :

- **Inscription** : `POST /signup`
- **Connexion** : `POST /login`
- **Mise à jour du nom d'utilisateur** : `PATCH /update` (nécessite un JWT)
- **Récupérer tous les utilisateurs** : `GET /users` (nécessite un JWT)
- **Récupérer le profil de l'utilisateur connecté** : `GET /me` (nécessite un JWT)
- **Poster un nouveau post** : `POST /posts` (nécessite un JWT)
- **Récupérer tous les posts** : `GET /posts` (nécessite un JWT)
- **Mise à jour d'un post** : `PATCH /posts/{id}` (nécessite un JWT)
- **Poster un commentaire** : `POST /comments` (nécessite un JWT)
- **Récupérer tous les commentaires d'un post** : `GET /comments/{postId}` (nécessite un JWT)

## Comment Utiliser 📚

Vous pouvez tester ces routes en utilisant Postman ou tout autre outil de requête HTTP en configurant le `Bearer Token` avec le JWT obtenu après la connexion.

## Contribution 🤝

Ce projet a été rendu possible grâce à la contribution significative de mon ami @Yassine94110.

---

Merci d'avoir consulté ce projet !
