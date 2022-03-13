import { Router, Request, Response } from 'express';

const router: Router = Router();

router.use('/', (req: Request, res: Response) => {
    res.status(200).send('Hello World!');
});


export default router;