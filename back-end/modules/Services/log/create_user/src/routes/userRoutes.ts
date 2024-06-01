import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as eventController from '../controllers/eventController';

const router = Router();

router.post('/register', userController.register);

router.post('/event',eventController.handleEvent);

export default router;
