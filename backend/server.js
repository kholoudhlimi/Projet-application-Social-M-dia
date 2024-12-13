
const http = require('http');


const app = require('./app');

// Fonction pour normaliser le port (vérifier et convertir la valeur donnée en entier, ou la retourner telle quelle si ce n'est pas un nombre)
const normalizePort = val => {
    const port = parseInt(val, 10); // Convertir la valeur du port en un entier en base 10
  
    // Si ce n'est pas un nombre, on retourne la valeur originale (peut être une chaîne de caractères comme 'pipe')
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    // Sinon, on retourne false pour indiquer que le port est invalide
    return false;
};

const port = normalizePort(process.env.PORT || '3000');

// On définit le port pour l'application Express (app) afin qu'elle l'utilise lors de la mise en écoute
app.set('port', port);

// Fonction de gestion des erreurs sur le serveur
const errorHandler = error => {
    // Si l'erreur n'est pas liée à la tentative d'écoute sur un port (syscall !== 'listen'), on la lance directement
    if (error.syscall !== 'listen') {
      throw error;
    }
    
    const address = server.address();
    
    // Construction de la chaîne pour indiquer si c'est un pipe ou un port
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    
    // Gestion spécifique des erreurs
    switch (error.code) {
      case 'EACCES': // Si l'erreur est liée à un problème de permission (e.g., accès refusé)
        console.error(bind + ' requires elevated privileges.'); // Affiche un message d'erreur spécifique
        process.exit(1); // Quitte le programme avec le code d'erreur 1
        break;
      case 'EADDRINUSE': // Si l'erreur est liée à l'adresse déjà en cours d'utilisation
        console.error(bind + ' is already in use.'); // Affiche un message d'erreur spécifique
        process.exit(1); // Quitte le programme avec le code d'erreur 1
        break;
      default: // Si c'est une autre erreur, elle est levée
        throw error;
    }
};

// Création du serveur HTTP en utilisant l'application Express 'app'
const server = http.createServer(app);

// Écoute des événements sur le serveur : gestion des erreurs et de l'état de l'écoute
server.on('error', errorHandler); // Si une erreur survient, appel de la fonction errorHandler
server.on('listening', () => {
    // Lorsque le serveur commence à écouter, on récupère l'adresse et on l'affiche
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind); // Affiche un message indiquant que le serveur écoute sur le port ou pipe
});


server.listen(port);
