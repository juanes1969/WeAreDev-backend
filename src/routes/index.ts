import { Router } from 'express';
import RouteHealthCheck from './health-check';

export * from './v1';

const router = Router();

router.use('/', RouteHealthCheck).use('/ping', RouteHealthCheck).use('/api/ping', RouteHealthCheck);

const routerHealthCheck = router;

export { routerHealthCheck };
