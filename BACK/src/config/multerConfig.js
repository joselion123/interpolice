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
    
    // Create error object with status code
    const error = new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)');
    error.status = 400;
    cb(error, false);
};

// Configuración de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Límite de 5MB
        files: 1 // Solo permitir un archivo por solicitud
    }
}).single('foto'); // 'foto' es el nombre del campo en el formulario

// Middleware para manejar errores de Multer
const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Un error de Multer (ej: archivo muy grande)
        return res.status(400).json({
            estado: 'error',
            mensaje: `Error al subir el archivo: ${err.message}`
        });
    } else if (err) {
        // Un error del fileFilter u otro error
        return res.status(err.status || 500).json({
            estado: 'error',
            mensaje: err.message || 'Error al procesar el archivo'
        });
    }
    // Si no hay errores, continuar
    next();
};

export { upload, handleMulterErrors };

export default upload;
