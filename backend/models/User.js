// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    password: { type: String }, // opcional para migraciones

    avatar: { type: String, default: '' }, // <-- campo para la foto de perfil (url o path)

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // optional profile fields for recommendations
    profile: {
      skinType: { type: String },
      concerns: [String],
      preferredBrands: [String]
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
