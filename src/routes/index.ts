import { Router } from 'express';
import GameRouter from './game.route';


const router: Router = Router();

router.use('/game', GameRouter);


export default router;