import mongoose from "mongoose";

const messageSchema = new Schema({
    text: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    chatId: { type: mongoose.Types.ObjectId, ref: 'Chat' },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Message = mongoose.model('Message', messageSchema);
  