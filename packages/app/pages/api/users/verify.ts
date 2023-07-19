import type {NextApiRequest, NextApiResponse} from 'next';
import db from '../../../libs/prisma';

// FIXME: Not used yet
export default async function verify(req: NextApiRequest, res: NextApiResponse) {
  const {email} = req.body;
  if (!email) res.status(400).send({error: 'User email is required.'});

  try {
    const user = await db.user.findUnique({where: {email}});

    if (user) {
      res.status(200).send(true);
    } else {
      res.status(400).send('User does not exist. Try different email.');
    }
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong.');
  }
}
