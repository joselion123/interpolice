import multer from 'multer';

// Middleware para manejar errores de Multer
export const handleMulterErrors = (err, req, res, next) => {
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