import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as eventController from '../controllers/eventController';

const router = Router();

router.post('/', userController.register);
router.get('/:login', userController.read);

router.post('/event',eventController.handleEvent);

export default router;
