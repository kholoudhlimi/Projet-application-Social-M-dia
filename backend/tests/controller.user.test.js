
const request = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
const User = require('../models/user.model');

// Mock du module bcrypt
jest.mock('bcrypt', () => ({
    hash: jest.fn(() => Promise.resolve('hashedpassword')),
    compare: jest.fn(() => Promise.resolve(true))
}));
// Mock du module jsonwebtoken
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'fakeToken')
}));

describe('User Authentication API', () => {

    // Avant chaque test, on peut s'assurer que la base de données est vide ou se préparer à la tester
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_LAB, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        // Supprimer les utilisateurs après chaque test pour éviter les conflits
        await User.deleteMany({});
    });

    // Test d'inscription d'un utilisateur
    it('should signup a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup') // Assurez-vous que l'URL correspond à votre route
            .send({
                pseudo: 'TestUser',
                email: 'testuser@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Utilisateur créé !');
        
        // Vérification dans la base de données que l'utilisateur a bien été créé
        const user = await User.findOne({ email: 'testuser@example.com' });
        expect(user).not.toBeNull();
        expect(user.pseudo).toEqual('TestUser');
    });

  })