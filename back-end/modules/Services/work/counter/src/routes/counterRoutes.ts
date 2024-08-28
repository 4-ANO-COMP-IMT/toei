import { Router } from 'express';
import * as counterController from '../controllers/counterController';
import * as eventController from '../controllers/eventController';

const router = Router();

router.put('/:id', counterController.counter_update);

router.post('/event',eventController.handleEvent);

export default router;