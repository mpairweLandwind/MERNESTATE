import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    latitude: String,
    longitude: String,
    type: { 
      type: String, 
      enum:['sell','buy','rent'],
       required: true
       },
    property: { 
      type: String,
       enum: ['land','apartment','condo','house'],
        required: true 
      },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },

    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    userId: { 
      type: mongoose.Types.ObjectId,
       ref: 'User' 
      },
    postDetail: { type: mongoose.Types.ObjectId,
       ref: 'PostDetail'
       },
    savedPosts: [{ 
      type: mongoose.Types.ObjectId, 
      ref: 'SavedPost' 
    }],
    
  });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
