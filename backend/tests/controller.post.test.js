const request = require('supertest');
const app = require('../app'); // Remplacez par le chemin vers votre fichier app.js ou server.js
const Post = require('../models/post.model');

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

    Post.prototype.save.mockResolvedValue(mockPost);

    const response = await request(app)
      .post('/api/posts/post')
      .send({ description: 'Nouveau post', userId: '6711744963960e1afcdf7b9' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockPost);
    expect(Post.prototype.save).toHaveBeenCalledTimes(1);
  });

  it('devrait récupérer tous les posts', async () => {
    const mockPosts = [
      {
        _id: '615f7f0f1c9d440000bda9cf',
        description: 'Post 1',
        userId: '6711744963960e1afcdf7b9',
        coments: [],
      },
    ];
  
    Post.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockPosts),
    });
  
    const response = await request(app).get('/api/posts');
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPosts);
    expect(Post.find).toHaveBeenCalledTimes(1);
  });
  // Test pour récupérer un post par ID
  it('devrait récupérer un post par ID', async () => {
    const mockPost = {
      _id: '615f7f0f1c9d440000bda9cf',
      description: 'Post 1',
      imageUrl: null,
      userId: '6711744963960e1afcdf7b9',
      coments: [],
    };

    Post.findById.mockResolvedValue(mockPost);

    const response = await request(app).get('/api/posts/615f7f0f1c9d440000bda9cf');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPost);
    expect(Post.findById).toHaveBeenCalledWith('615f7f0f1c9d440000bda9cf');
  });

  // Test pour mettre à jour un post
  it('devrait mettre à jour un post', async () => {
    const mockPost = {
      _id: '615f7f0f1c9d440000bda9cf',
      description: 'Post à mettre à jour',
      imageUrl: null,
      userId: '6711744963960e1afcdf7b9',
      coments: [],
    };

    Post.findById.mockResolvedValue(mockPost);
    Post.prototype.save.mockResolvedValue(mockPost);

    const response = await request(app)
      .put('/api/posts/post/615f7f0f1c9d440000bda9cf')
      .send({ description: 'Post mis à jour' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post mis à jour avec succès');
    expect(response.body.post.description).toBe('Post mis à jour');
    expect(Post.findById).toHaveBeenCalledWith('615f7f0f1c9d440000bda9cf');
    expect(Post.prototype.save).toHaveBeenCalledTimes(1);
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