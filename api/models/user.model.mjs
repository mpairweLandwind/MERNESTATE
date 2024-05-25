import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['admin', 'landlord', 'user'],
      default: 'user',
      
    },
    password: {
      type: String,
      required: true,
    },
   
    avatar: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },  
  createdAt: { type: Date, default: Date.now },

posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
savedPosts: [{ type: mongoose.Types.ObjectId, ref: 'SavedPost' }],
chats: [{ type: mongoose.Types.ObjectId, ref: 'Chat' }],
chatIDs: [mongoose.Types.ObjectId]

});
const User = mongoose.model('User', userSchema);

export default User;
