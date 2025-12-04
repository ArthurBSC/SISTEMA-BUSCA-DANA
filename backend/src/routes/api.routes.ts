import { Router } from 'express';
import { ApiController } from '../controllers/ApiController';

const router = Router();

router.get('/estatisticas', ApiController.estatisticas);
router.get('/info-buscas', ApiController.infoBuscas);

export { router as apiRoutes };

