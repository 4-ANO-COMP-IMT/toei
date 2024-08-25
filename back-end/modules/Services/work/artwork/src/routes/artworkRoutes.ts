import { Router } from 'express';
import * as artworkController from '../controllers/artworkController';
import * as eventController from '../controllers/eventController';

const router = Router();

router.post('/', artworkController.create_artwork);

router.get('/:id', artworkController.read_artwork);

router.put('/:id', artworkController.update_artwork);

router.delete('/:id', artworkController.delete_artwork);

router.post('/event',eventController.handleEvent);

export default router;
