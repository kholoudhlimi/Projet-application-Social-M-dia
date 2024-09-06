const Coment = require('../models/coment.model');  // Importation du modèle Coment
const mongoose = require('mongoose');

exports.createComent = async (req, res) => {
  try {
    const { userId, postId, coment } = req.body;

    const newComent = new Coment({
      userId,
      postId,
      coment
    });

    const savedComent = await newComent.save();
    res.status(201).json(savedComent);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du commentaire', error });
  }
};

exports.getComentsByPostId = async (req, res) => {
  try {
    const coments = await Coment.find({ postId: req.params.postId }).populate('userId', 'name email');
    res.status(200).json(coments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error });
  }
};

exports.updateComent = async (req, res) => {
  try {
    const { coment } = req.body;

    const updatedComent = await Coment.findByIdAndUpdate(
      req.params.id,
      { coment },
      { new: true, runValidators: true }
    );

    if (!updatedComent) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.status(200).json(updatedComent);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du commentaire', error });
  }
};

exports.deleteComent = async (req, res) => {
  try {
    const deletedComent = await Coment.findByIdAndDelete(req.params.id);

    if (!deletedComent) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.status(200).json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du commentaire', error });
  }
};