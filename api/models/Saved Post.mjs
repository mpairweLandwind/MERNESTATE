import mongoose from "mongoose";

const savedPostSchema = new Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', unique: true },
    postId: { type: mongoose.Types.ObjectId, ref: 'Post', unique: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });
  
  const SavedPost = mongoose.model('SavedPost', savedPostSchema);
  