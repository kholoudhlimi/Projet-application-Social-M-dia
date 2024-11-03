const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Chemin vers votre fichier d'application
const User = require('../models/user.model');

beforeAll(async () => {
  const MONGO_ACCESS = process.env.MONGO_LAB;
  try {
    await mongoose.connect(MONGO_ACCESS, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connexion à MongoDB réussie !');
  } catch (error) {
    console.error('Connexion à MongoDB échouée !', error);
    throw error; // Relancer l'erreur pour échouer le test
  }
});

afterAll(async () => {
  await User.deleteMany(); // Nettoyer la base de données après les tests
  await mongoose.connection.close();
  console.log('Connexion à MongoDB fermée !');
});

describe('API Authentification', () => {
  it('devrait inscrire un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Utilisateur créé !');
  });

  it('devrait connecter un utilisateur existant', async () => {
    // Assurez-vous que l'utilisateur est enregistré avant d'essayer de se connecter
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Connexion réussie !');
    expect(res.body.token).toBeDefined(); // Vérifiez que le token est présent
  });

  it('ne devrait pas créer un administrateur si un existe déjà', async () => {
    // Créer un premier administrateur
    await request(app)
      .post('/api/auth/admin')
      .send({
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'adminpassword'
      });

    // Essayer de créer un deuxième administrateur
    const res = await request(app)
      .post('/api/auth/admin')
      .send({
        username: 'anotheradmin',
        email: 'anotheradmin@example.com',
        password: 'anotherpassword'
      });

    expect(res.statusCode).toBe(400); // Assurez-vous que la réponse est 400
    expect(res.body.message).toBe('Un administrateur existe déjà !');
  });

  it('devrait déconnecter un utilisateur', async () => {
    // Créez d'abord un utilisateur et connectez-vous pour obtenir un token
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword'
      });

    const token = loginRes.body.token;

    // Maintenant, testez la déconnexion
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`); // Ajoutez le token d'authentification

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Déconnexion réussie !');
  });
});
