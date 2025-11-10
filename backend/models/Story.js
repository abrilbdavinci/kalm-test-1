// models/Story.js
import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
  title: { type: String, default: '' },
  image: { type: String, required: true }, // URL/Path del asset
  link: { type: String, default: '' }, // ruta interna o externa
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  audience: { 
    // opcional: criterios para filtrar historias por perfil
    skinTypes: [String], // e.g. ['oily','dry','combination']
    hairTypes: [String],
    tags: [String]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

StorySchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Story', StorySchema);
