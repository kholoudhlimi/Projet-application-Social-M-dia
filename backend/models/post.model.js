const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  description: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: false 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "User" 
  },
  coments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coment' }] 
}, 
{ timestamps: true }); 

module.exports = mongoose.model("Post", postSchema);
