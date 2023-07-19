import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import db from '../../../libs/prisma';
import {ISession} from '../../../utils/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getSession({req})) as ISession;
  if (!session?.user?.organizationId) return res.status(401).send('Unauthorized');

  if (req.method === 'GET') return getAll(req, res, session);
  if (req.method === 'POST') return create(req, res, session);
  if (req.method === 'PUT') return update(req, res, session);

  return res.status(405).send(`Method ${req.method} not allowed`);
}

// Retrieves all users per organizationId
export async function getAll(_: NextApiRequest, res: NextApiResponse, session: ISession) {
  const users = await db.user.findMany({where: {organizationId: session!.user!.organizationId}});
  return res.status(200).json(users);
}

// Creates a new project
export async function create(req: NextApiRequest, res: NextApiResponse, session: ISession) {
  const {organizationId} = session!.user!;
  const {name, email, image} = req.body;

  if (!name) return res.status(400).send('Missing project name');
  if (!email) return res.status(400).send('Missing user email');

  const project = await db.user.create({data:  {organizationId, name, email, image}});

  return res.status(200).json(project);
}

// Updates a project
export async function update(req: NextApiRequest, res: NextApiResponse,  _: ISession) {
  const {id, name, email, image} = req.body;

  if (!id) return res.status(400).send('Missing user id');

  const user = await db.user.update({where: {id}, data: {name, email, image}});

  return res.status(200).json(user);
}
