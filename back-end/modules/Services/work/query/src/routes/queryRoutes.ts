import { Router } from 'express';
import * as queryController from '../controllers/queryController';
import * as eventController from '../controllers/eventController';

const router = Router();

router.post('/', queryController.query_artworks);

router.get('/tags', queryController.read_tags);

router.post('/event',eventController.handleEvent);

export default router;
