import type {NextApiRequest, NextApiResponse} from 'next';
import db from '../../../libs/prisma';

export default async function signUp(req: NextApiRequest, res: NextApiResponse) {
  const {organization: organizationData, user: userData} = req.body;

  if (!userData.email) res.status(400).send({error: 'User email is required.'});

  await db.organization.create({
    data: {
      name: organizationData.name || 'My Organization',
      users: {create: [{email: userData.email, name: userData.name}]},
      projects: {create: [{name: 'My Project'}]}
    }
  });

  res.status(200).send(true);
}
