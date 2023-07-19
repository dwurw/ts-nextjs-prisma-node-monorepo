import {PrismaClient, Project} from '@fluxusform/prisma';
import {Request} from 'express';
import db from '../libs/database';

export interface ExtendedRequest extends Request {
  db: PrismaClient;
  project: Project;
}

export default function addDatabase(req: ExtendedRequest, _, next) {
  req.db = db;
  next();
}
