import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as eventController from '../controllers/eventController';

const router = Router();

router.post('/', userController.create_user);

router.get('/', userController.read_user);

router.put('/', userController.update_user);

router.delete('/', userController.delete_user);

router.post('/event',eventController.handleEvent);

export default router;
