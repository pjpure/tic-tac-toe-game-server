import { Router } from 'express';

const router = Router();

router.get('/room', (req, res) => {
    res.send('Hello World');
});

export default router;