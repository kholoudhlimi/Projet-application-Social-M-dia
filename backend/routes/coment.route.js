const express = require('express');
const router = express.Router();
const comentController = require('../controllers/coment.controller');

router.post('/coments', comentController.createComent);
router.get('/coments/post/:postId', comentController.getComentsByPostId);
router.put('/coments/:id', comentController.updateComent);
router.delete('/coments/:id', comentController.deleteComent);

module.exports = router;
