import {PrismaClient} from '@fluxusform/prisma';
import constants from '../constants';

const db = new PrismaClient({datasources: {db: {url: constants.db}}});

export default db;
