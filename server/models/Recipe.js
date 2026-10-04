import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  cookTime: Number,
  ingredients: [String],
  steps: [String],
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

recipeSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
  },
});

export default mongoose.model('Recipe', recipeSchema);
