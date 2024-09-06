const mongoose = require("mongoose");

const comentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "User" 
  },
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "Post" 
  },
  coment: { 
    type: String, 
    required: true 
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Coment", comentSchema);
