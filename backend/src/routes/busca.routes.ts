import { Router } from 'express';
import { BuscaController } from '../controllers/BuscaController';

const router = Router();

router.post('/', BuscaController.buscar);
router.post('/limpar-cache', BuscaController.limparCache);

export { router as buscaRoutes };

