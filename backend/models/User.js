// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }, // ahora obligatorio
    password: { type: String } // opcional, para usuarios antiguos
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
