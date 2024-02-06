import { Router } from 'express';
import { Controllers } from '../../controllers';

const router = Router();

router.get('/', Controllers.HealthCheck.Get);

export default router;
