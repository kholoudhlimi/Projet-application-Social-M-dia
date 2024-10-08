const request = require('supertest');
const app = require('../app'); // Assurez-vous d'importer l'application Express
const mongoose = require('mongoose');
const User = require('../models/user.model');

describe('Auth Routes', () => {
  // Nettoyage de la base de données avant chaque test
  beforeEach(async () => {
    await User.deleteMany();
  });

  // Fermer la connexion à la base de données après tous les tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test de la route signup pour créer un nouvel utilisateur avec une image
  it('should create a new user with an image', async () => {
    const filePath = `${__dirname}/../uploads/profile/test.png`; // Assurez-vous que le chemin est correct et que l'image existe

    const res = await request(app)
      .post('/api/auth/signup')
      .field('username', 'testuser')
      .field('email', 'test@example.com')
      .field('password', 'testpassword')
      .attach('picture', filePath); // Envoie de l'image

    expect(res.statusCode).toBe(201); // Vérifie que le statut est 201
    expect(res.body).toHaveProperty('message', 'Utilisateur créé !'); // Vérifie que le message est correct

    const user = await User.findOne({ email: 'test@example.com' }); // Recherche l'utilisateur dans la base de données
    expect(user).toBeTruthy(); // Vérifie que l'utilisateur a bien été créé
    expect(user.username).toBe('testuser'); // Vérifie que le nom d'utilisateur est correct
  });

  // Test de la route signup pour vérifier l'erreur si aucune image n'est téléchargée
  it('should return error if no image is uploaded', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .field('username', 'testuser')
      .field('email', 'test@example.com')
      .field('password', 'testpassword');

    expect(res.statusCode).toBe(400); // Vérifie que le statut est 400
    expect(res.body).toHaveProperty('error', 'Aucune image téléchargée.'); // Vérifie que le message d'erreur est correct
  });

  // Test de la route login pour un utilisateur existant
  it('should login an existing user', async () => {
    // Crée d'abord un utilisateur pour pouvoir le connecter
    await request(app)
      .post('/api/auth/signup')
      .field('username', 'testuser')
      .field('email', 'test@example.com')
      .field('password', 'testpassword')
      .attach('picture', `${__dirname}/../uploads/profile/test.png`);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Connexion réussie !');
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('username', 'testuser');
  });

  // Test de la route login pour un utilisateur non trouvé
  it('should return error if user is not found', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'testpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Utilisateur non trouvé !');
  });

  // Test de la route login pour un mot de passe incorrect
  it('should return error if password is incorrect', async () => {
    await request(app)
      .post('/api/auth/signup')
      .field('username', 'testuser')
      .field('email', 'test@example.com')
      .field('password', 'testpassword')
      .attach('picture', `${__dirname}/../uploads/profile/test.png`);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Mot de passe incorrect !');
  });

  // Test de la création d'un administrateur
  it('should create a new admin', async () => {
    const res = await request(app)
    .post('/api/auth/admin')
    .field('username', 'adminuser')
    .field('email', 'admin@example.com')
    .field('password', 'adminpassword')
    .attach('picture',`${__dirname}/../uploads/profile/test.png`); // Envoie de l'image

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty('message', 'Administrateur créé avec succès !');

  const admin = await User.findOne({ email: 'admin@example.com' });
  expect(admin).toBeTruthy();
  expect(admin.role).toBe('admin');
  expect(admin.picture).toContain('/uploads/profile/test.png'); // Vérifie que le chemin de l'image est correct
});


  // Test de la déconnexion
  it('should logout the user', async () => {
    const res = await request(app)
      .post('/api/auth/logout');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Déconnexion réussie !');
  });
});
