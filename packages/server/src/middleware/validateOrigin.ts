import {ExtendedRequest} from './addDatabase';

// FIXME: weak security
export default async function validateOrigin(req: ExtendedRequest, res, next) {
  const origin = req.headers.origin;

  const projectId = req.headers['x-trackify-project-id'];

  if (typeof projectId !== 'string') {
    return res.status(400).send({error: 'Project id is required.'});
  }

  const project = await req.db.project.findUnique({where: {id: projectId}});

  if (!project) {
    return res.status(404).send('Project not found');
  }

  if (origin === project.url) {
    req.project = project;
    next();
  } else {
    return res.status(403).send({error: 'Invalid origin'});
  }
}
