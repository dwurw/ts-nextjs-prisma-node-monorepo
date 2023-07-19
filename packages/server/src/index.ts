import cors from 'cors';
import express from 'express';
import constants from './constants';
import router from './router';
import parseAttributes from './utils/parseAttributes';
const app = express();

app.use(cors({origin: '*', credentials: true}));

app.get('/', (_, res) => res.send('Server is running. 200 OK'));

/** Router, that handles all webhooks used by app */
app.use('/api/v1', router);

process.on('uncaughtException', function (err) {
  console.log('UncaughtException');
  console.error(err);
});

app.listen(Number(process.env.PORT) || 5000, () => {
  console.log(`🚀 Server ready at ${constants.baseUrl}`);
});
