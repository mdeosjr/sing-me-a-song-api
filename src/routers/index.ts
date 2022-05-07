import { Router } from 'express';
import testsRouter from "./testsRouter.js";
import recommendationRouter from './recommendationRouter.js';

const router = Router();

router.use('/recommendations', recommendationRouter);
if (process.env.NODE_ENV === 'tests') {
	router.use(testsRouter);
}

export default router;