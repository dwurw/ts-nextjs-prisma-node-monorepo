import express from 'express';
import {Response} from 'express';
import {ExtendedRequest} from '../middleware/addDatabase';
import validateOrigin from '../middleware/validateOrigin';
import parseAttributes from '../utils/parseAttributes';

async function createEvent(req: ExtendedRequest, res: Response) {

  return res.status(204).end();
}

const eventsRouter = express.Router();

eventsRouter.use(validateOrigin);
eventsRouter.route('/').post(createEvent);

export default eventsRouter;
