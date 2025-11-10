import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "El autor es obligatorio."]
    },
    content: { 
      type: String, 
      required: [true, "El contenido es obligatorio."],
      trim: true,
      minlength: [3, "El contenido debe tener al menos 3 caracteres."]
    },
    image: { 
      type: String, 
      default: null 
    },
    likes: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    theme: {
      type: [String],
      enum: ["haircare", "skincare"],
      required: [true, "El tema es obligatorio."],
      validate: {
        validator: function (value) {
          return value.length > 0 && value.length <= 2; // puede tener 1 o ambos temas
        },
        message: "Debe tener al menos un tema válido (haircare o skincare)."
      }
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
