import mongoose from 'mongoose';


const postDetailSchema = new Schema({
    desc: { type: String, required: true },
    utilities: String,
    pet: String,
    income: String,
    size: Number,
    school: Number,
    bus: Number,
    restaurant: Number,
    postId: { type: mongoose.Types.ObjectId, ref: 'Post', unique: true }
  });
  
  const PostDetail = mongoose.model('PostDetail', postDetailSchema);
  