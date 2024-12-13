const request = require('supertest');
const app = require('../app'); 
const Coment = require('../models/coment.model');
const Post = require('../models/post.model');
const mongoose= require('mongoose')
// Mock du modèle Coment et Post
jest.mock('../models/coment.model');
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
afterAll(async () => {
  await mongoose.disconnect(); // Fermer la connexion MongoDB
});
// Tests pour le contrôleur Coment
describe('Coment Controller', () => {
  // Test pour créer un commentaire
  it('devrait créer un nouveau commentaire', async () => {
    const mockPost = {
      _id: '67141edb5c3e88e21a2e7379',
      coments: [],
      save: jest.fn(), // Simuler la méthode save du post
    };
  
    const mockComent = {
      _id: '67141edb5c3e88e21a2e7380',
      userId: '6711744963960e1afcdf7b9',
      postId: '67141edb5c3e88e21a2e7379',
      coment: 'Ceci est un commentaire',
    };
  
    // Simulez la récupération du post
    Post.findById.mockResolvedValue(mockPost);
    // Simulez l'enregistrement du commentaire
    Coment.prototype.save.mockResolvedValue(mockComent);
  
    const response = await request(app)
      .post('/api/coments/coment') // Assurez-vous que c'est la bonne route
      .send({ postId: '67141edb5c3e88e21a2e7379', coment: 'Ceci est un commentaire' });
    
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockComent);
    expect(Post.findById).toHaveBeenCalledWith('67141edb5c3e88e21a2e7379');
    expect(mockPost.coments).toContain(mockComent._id);
    expect(mockPost.save).toHaveBeenCalled(); // Vérifie que la méthode save a été appelée
  });

  // Test pour récupérer tous les commentaires
  it('devrait récupérer tous les commentaires', async () => {
    // Données mockées
    const mockComents = [
      {
        _id: '615f7f0f1c9d440000bda9cf',
        text: 'Premier commentaire',
        userId: {
          username: 'TestUser',
          picture: 'test.png'
        }
      },
      {
        _id: '615f7f0f1c9d440000bda9d0',
        text: 'Deuxième commentaire',
        userId: {
          username: 'AnotherUser',
          picture: 'another.png'
        }
      }
    ];

    // Mock de la méthode find et populate
    Coment.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockComents)
      })
    });

    const response = await request(app).get('/api/coments/coment');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockComents);
    expect(Coment.find).toHaveBeenCalledTimes(1);
  });


  // Test pour récupérer les commentaires par ID de post
  it('devrait récupérer les commentaires par ID de post', async () => {
    const mockComents = [
      {
        _id: '615f7f0f1c9d440000bda9d1',
        userId: '6711744963960e1afcdf7b9',
        postId: '615f7f0f1c9d440000bda9cf',
        coment: 'Ceci est un commentaire',
      },
    ];

    Coment.find.mockResolvedValue(mockComents); // Simule la récupération des commentaires par postId

    const response = await request(app).get('/api/coments/coment/posts/615f7f0f1c9d440000bda9cf');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockComents);
    expect(Coment.find).toHaveBeenCalledWith({ postId: '615f7f0f1c9d440000bda9cf' });
  });
 
  // Test pour mettre à jour un commentaire
  it('devrait mettre à jour un commentaire si l\'utilisateur est le propriétaire ou un admin', async () => {
    const mockComent = {
      _id: '615f7f0f1c9d440000bda9d1',
      userId: '6711744963960e1afcdf7b9',
      postId: '615f7f0f1c9d440000bda9cf',
      coment: 'Ceci est un commentaire',
      save: jest.fn(), // Simule la méthode save
    };
  
    // Simule la récupération du commentaire
    Coment.findById.mockResolvedValue(mockComent);
    // Simule l'enregistrement du commentaire mis à jour
    const updatedComent = { ...mockComent, coment: 'Commentaire mis à jour' };
    mockComent.save.mockResolvedValue(updatedComent);
  
    const response = await request(app)
      .put('/api/coments/coment/' + mockComent._id)
      .send({ coment: 'Commentaire mis à jour' });
  
    expect(response.status).toBe(200);
    
    expect(response.body).toEqual({
      _id: updatedComent._id,
      coment: 'Commentaire mis à jour',
      postId: updatedComent.postId,
      userId: updatedComent.userId,
    });
    expect(Coment.findById).toHaveBeenCalledWith(mockComent._id);
    expect(mockComent.save).toHaveBeenCalled();
  });
  // Test pour supprimer un commentaire
  it('devrait supprimer un commentaire si l\'utilisateur est le propriétaire ou un admin', async () => {
    const mockComent = {
      _id: '615f7f0f1c9d440000bda9d1',
      userId: '6711744963960e1afcdf7b9',
      postId: '615f7f0f1c9d440000bda9cf',
      coment: 'Ceci est un commentaire',
    };
  
    // Simule la récupération du commentaire
    Coment.findById.mockResolvedValue(mockComent); 
  
    const response = await request(app).delete('/api/coments/coment/' + mockComent._id);
  
    // Simule la suppression du commentaire
    Coment.findByIdAndDelete.mockResolvedValue(mockComent);
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Commentaire supprimé avec succès');
    expect(Coment.findByIdAndDelete).toHaveBeenCalledWith(mockComent._id);
  });
});