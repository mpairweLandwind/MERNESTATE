import mongoose from "mongoose";


const chatSchema = new Schema({
    users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    userIDs: [mongoose.Types.ObjectId],
    createdAt: { type: Date, default: Date.now },
    seenBy: [mongoose.Types.ObjectId],
    messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
    lastMessage: String
  });
  
  const Chat = mongoose.model('Chat', chatSchema);
  