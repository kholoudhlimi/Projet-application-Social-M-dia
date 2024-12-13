const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user.model');

describe('API Authentification', () => {
  let createdUsers = []; // Stocker les IDs des utilisateurs créés pendant les tests

  beforeAll(async () => {
    const MONGO_ACCESS = process.env.MONGO_LAB;
    if (!MONGO_ACCESS) {
      throw new Error("La variable MONGO_LAB n'est pas définie dans l'environnement.");
    }

    try {
      await mongoose.connect(MONGO_ACCESS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connexion à MongoDB réussie !');
    } catch (error) {
      console.error('Connexion à MongoDB échouée !', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      // Supprimer uniquement les utilisateurs créés pendant les tests
      for (const userId of createdUsers) {
        await User.findByIdAndDelete(userId);
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage des utilisateurs :', error);
    }

    try {
      await mongoose.connection.close();
      console.log('Connexion à MongoDB fermée !');
    } catch (error) {
      console.error('Erreur lors de la fermeture de la connexion à MongoDB :', error);
    }
  });

  it('devrait inscrire un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Utilisateur créé !');

    // Ajouter l'utilisateur créé à la liste
    const user = await User.findOne({ email: 'test@example.com' });
    if (user) {
      createdUsers.push(user._id);
    }
  });

  it('devrait connecter un utilisateur existant', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      });

    const user = await User.findOne({ email: 'test@example.com' });
    if (user) {
      createdUsers.push(user._id);
    }

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Connexion réussie !');
    expect(res.body.token).toBeDefined();
  });

  it('ne devrait pas créer un administrateur si un existe déjà', async () => {
    const adminRes = await request(app)
      .post('/api/auth/admin')
      .send({
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'adminpassword',
      });

    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (adminUser) {
      createdUsers.push(adminUser._id);
    }

    const res = await request(app)
      .post('/api/auth/admin')
      .send({
        username: 'anotheradmin',
        email: 'anotheradmin@example.com',
        password: 'anotherpassword',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Un administrateur existe déjà !');
  });

  it('devrait déconnecter un utilisateur', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      });

    const user = await User.findOne({ email: 'test@example.com' });
    if (user) {
      createdUsers.push(user._id);
    }

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });

    const token = loginRes.body.token;
    expect(token).toBeDefined();

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Déconnexion réussie !');
  });
});
