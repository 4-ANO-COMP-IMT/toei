import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as eventController from '../controllers/eventController';

const router = Router();

router.post('/', userController.register);

// mss para teste do front
// router.put('/teste', (req, res)=>{
//     res.json({"mensagem":req.body.mensagem});
// });

router.get('/:login', userController.read);

router.post('/event',eventController.handleEvent);

export default router;
