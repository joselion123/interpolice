import express from 'express';
import ciudadanos from './ciudadanos.js';
import crimenes from './crimenes.js';

const router = express.Router();

router.use('/', ciudadanos);
router.use('/', crimenes);

export default router;