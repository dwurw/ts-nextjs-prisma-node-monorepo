import {PrismaClient} from '@fluxusform/prisma'

const db = new PrismaClient({datasources: {db: {url: process.env.DATABASE_URL}}})

export default db;