import { Router } from 'express';
import * as artworkController from '../controllers/artworkController';
import * as eventController from '../controllers/eventController';

const router = Router();

router.post('/', artworkController.create_artwork);

router.get('/:position', artworkController.read_artwork);

router.put('/:position', artworkController.update_artwork);

router.delete('/:position', artworkController.delete_artwork);

router.post('/event',eventController.handleEvent);

export default router;
