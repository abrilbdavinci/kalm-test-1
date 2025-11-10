// models/Banner.js
import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  image: { type: String, required: true },
  alt: { type: String, default: '' },
  link: { type: String, default: '' }, // ruta interna o externa
  position: { type: String, default: 'home_top' }, // ej. 'home_top','home_secondary'
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  startAt: { type: Date },
  endAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

BannerSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Banner', BannerSchema);
