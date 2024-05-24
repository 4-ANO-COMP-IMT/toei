import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.post('/register', userController.register);

export default router;
