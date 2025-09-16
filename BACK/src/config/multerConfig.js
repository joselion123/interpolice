import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: function (req, file, cb) {
        // Generar un nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'ciudadano-' + uniqueSuffix + ext);
    }
});

// Filtro para solo permitir imágenes
const fileFilter = (req, file, cb) => {
    const filetypes = /jpe?g|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    
    const error = new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)');
    error.status = 400;
    cb(error, false);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Límite de 5MB
        files: 1 
    }
}).single('foto'); 

export { upload };

export default upload;
