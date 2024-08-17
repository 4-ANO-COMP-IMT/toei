import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as eventController from '../controllers/eventController';

const router = Router();

router.post('/', authController.login);

router.post('/event', eventController.handleEvent);

router.get('/cookies',authController.cookies);

export default router;
