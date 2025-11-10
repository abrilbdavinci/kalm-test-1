import multer from "multer";
import path from "path";
import fs from "fs";

// === 📁 Directorios de subida ===
const postDir = path.resolve("uploads/posts");
const avatarDir = path.resolve("uploads/avatars");

// Crear los directorios si no existen
[postDir, avatarDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("📁 Carpeta creada:", dir);
  }
});

// === ⚙️ Filtro de archivos permitidos ===
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimeOK = allowedTypes.test(file.mimetype);
  const extOK = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeOK && extOK) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos de imagen (jpg, png, gif, webp)"));
  }
};

// === 🖼️ Configuración para imágenes de posts ===
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, postDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `post-${unique}${path.extname(file.originalname)}`);
  },
});
export const uploadPost = multer({
  storage: postStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // máx. 5MB
});

// === 👤 Configuración para avatares de usuario ===
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${unique}${path.extname(file.originalname)}`);
  },
});
export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // máx. 3MB
});
