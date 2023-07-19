import express from 'express';
import addDatabase from '../middleware/addDatabase';
import eventsRouter from './events';

const router = express.Router();

router.use(addDatabase)
router.use('/events', eventsRouter);

export default router;
