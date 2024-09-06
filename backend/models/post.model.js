const mongoose = require("mongoose");
const Comment = require("./coment.model"); 

const postSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "User" 
  },
  comments: [Comment.schema], 
}, 
{ timestamps: true }); 

module.exports = mongoose.model("Post", postSchema);
