import express from "express";
import * as testsController from '../controllers/testsController.js';

const testsRouter = express.Router();

testsRouter.post('/reset-database', testsController.resetDatabase);

export default testsRouter;