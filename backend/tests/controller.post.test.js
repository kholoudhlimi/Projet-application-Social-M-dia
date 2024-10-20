const request = require('supertest');
const app = require('../app'); // Remplacez par le chemin vers votre fichier app.js ou server.js
const Post = require('../models/post.model');
const mongoose = require('mongoose');

// Mock du modèle Post
jest.mock('../models/post.model');

// Mock du middleware d'authentification
jest.mock('../middleware/auth', () => (req, res, next) => {
  req.auth = { userId: '6711744963960e1afcdf7b9' }; // Simule un utilisateur authentifié
  next();
});

// Setup avant chaque test
beforeEach(() => {
  jest.clearAllMocks();
});

// Teardown après tous les tests pour fermer la connexion MongoDB
afterAll(async () => {
  await mongoose.disconnect(); // Fermer la connexion MongoDB
});

// Tests pour le contrôleur Post
describe('Post Controller', () => {
  
  // Test pour créer un post
  it('devrait créer un nouveau post', async () => {
    const mockPost = {
      _id: '615f7f0f1c9d440000bda9cf',
      description: 'Nouveau post',
      imageUrl: null,
      userId: '6711744963960e1afcdf7b9',
      coments: [],
    };

    // Simuler le comportement de Post.prototype.save
    Post.prototype.save = jest.fn().mockResolvedValue(mockPost);

    const response = await request(app)
      .post('/api/posts/post')
      .send({ description: 'Nouveau post' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockPost);
    expect(Post.prototype.save).toHaveBeenCalledTimes(1);
  });

  // Test pour récupérer tous les posts
  it('devrait récupérer tous les posts', async () => {
    const mockPosts = [
      {
        _id: '615f7f0f1c9d440000bda9cf',
        description: 'Post 1',
        userId: '6711744963960e1afcdf7b9',
        coments: [],
      },
    ];

    const mockPostQuery = {
      populate: jest.fn().mockResolvedValue(mockPosts),
      exec: jest.fn().mockResolvedValue(mockPosts),
    };

    Post.find.mockReturnValue(mockPostQuery); // Mock la méthode find

    const response = await request(app).get('/api/posts/post');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPosts);
    expect(Post.find).toHaveBeenCalledTimes(1);
  });
  it('devrait récupérer un post par ID', async () => {
    const mockPost = {
      _id: '615f7f0f1c9d440000bda9cf',
      description: 'Post 1',
      imageUrl: null,
      userId: '6711744963960e1afcdf7b9',
      coments: [],
    };

    Post.findById.mockResolvedValueOnce(mockPost); // Utilisez mockResolvedValueOnce pour éviter les interférences avec d'autres tests

    const response = await request(app).get('/api/posts/post/615f7f0f1c9d440000bda9cf');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPost);
    expect(Post.findById).toHaveBeenCalledWith('615f7f0f1c9d440000bda9cf');
  });
  // Test pour mettre à jour un post
  it('devrait mettre à jour un post', async () => {
    const updatedPost = {
      _id: '615f7f0f1c9d440000bda9cf',
      description: 'Post mis à jour',
      imageUrl: null,
      userId: '6711744963960e1afcdf7b9',
      coments: [],
    };
  
    const mockPostInstance = {
      ...updatedPost,
      save: jest.fn().mockResolvedValue(updatedPost), // Mock de la méthode save
    };
  
    Post.findById.mockResolvedValue(mockPostInstance); // Retourne une instance du post
  
    const response = await request(app)
      .put('/api/posts/post/615f7f0f1c9d440000bda9cf')
      .send({ description: 'Post mis à jour' });
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post mis à jour avec succès');
    expect(response.body.post.description).toBe('Post mis à jour');
    expect(mockPostInstance.save).toHaveBeenCalledTimes(1); 
  });

  // Test pour supprimer un post
  it('devrait supprimer un post', async () => {
    const mockPost = {
      _id: '615f7f0f1c9d440000bda9cf',
      description: 'Post à supprimer',
      imageUrl: null,
      userId: '6711744963960e1afcdf7b9',
      coments: [],
    };

    Post.findById.mockResolvedValue(mockPost);
    Post.findByIdAndDelete.mockResolvedValue(mockPost);

    const response = await request(app)
      .delete('/api/posts/post/615f7f0f1c9d440000bda9cf');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Post supprimé avec succès');
    expect(Post.findById).toHaveBeenCalledWith('615f7f0f1c9d440000bda9cf');
    expect(Post.findByIdAndDelete).toHaveBeenCalledWith('615f7f0f1c9d440000bda9cf');
  });
});
