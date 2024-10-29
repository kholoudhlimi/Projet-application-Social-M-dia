const request = require('supertest');
const app = require('../app'); // Remplacez par le chemin vers votre fichier app.js ou server.js
const Post = require('../models/post.model');
const mongoose = require('mongoose');

// Mock du modèle Post
jest.mock('../models/post.model');

// Mock du middleware d'authentification
jest.mock('../middleware/auth', () => (req, res, next) => {
  req.auth = { userId: '6711744963960e1afcdf7b9', role: 'user' }; // Simule un utilisateur authentifié
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
      coments: [], // Corrections ici
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
        imageUrl: null,
        userId: {
          _id: '6711744963960e1afcdf7b9',
          username: 'Test',
          picture: 'test.png',
        },
        coments: [],
      },
    ];
  
    // Mock de la méthode find
    Post.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockPosts), // Retourne les posts
        }),
      }),
    });
  
    const response = await request(app).get('/api/posts/post');
    
    console.log('Response Body:', response.body); // Pour voir ce qui est retourné
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
      coments: [], // Corrections ici
    };

    Post.findById.mockResolvedValueOnce(mockPost);

    const response = await request(app).get('/api/posts/post/615f7f0f1c9d440000bda9cf');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPost);
    expect(Post.findById).toHaveBeenCalledWith('615f7f0f1c9d440000bda9cf');
  });

  // Test pour mettre à jour un post
  it('devrait mettre à jour un post', async () => {
    const mockPost = {
      _id: '615f7f0f1c9d440000bda9cf',
      description: 'Post initial',
      userId: '6711744963960e1afcdf7b9',
      coments: [] // Corrections ici
    };
  
    // Simuler la méthode save après la déclaration
    mockPost.save = jest.fn().mockResolvedValue({
      ...mockPost,
      description: 'Post mis à jour'
    });
  
    Post.findById.mockResolvedValue(mockPost);
  
    const response = await request(app)
      .put('/api/posts/post/615f7f0f1c9d440000bda9cf')
      .send({ description: 'Post mis à jour' });
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post mis à jour avec succès');
    expect(response.body.post.description).toBe('Post mis à jour');
  });

  // Test pour supprimer un post
  it('devrait supprimer un post', async () => {
    const mockPost = {
      _id: '615f7f0f1c9d440000bda9cf',
      description: 'Post à supprimer',
      userId: '6711744963960e1afcdf7b9',
      imageUrl: null
    };

    Post.findById.mockResolvedValue(mockPost);
    Post.findByIdAndDelete.mockResolvedValue(mockPost);

    const response = await request(app)
      .delete(`/api/posts/post/${mockPost._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post supprimé avec succès');
  });

});
