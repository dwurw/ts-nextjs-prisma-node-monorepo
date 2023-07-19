import NextAuth, {NextAuthOptions} from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import {NextApiHandler} from 'next';
import db from '../../../libs/prisma';
import axios from 'axios';
import {Provider} from 'next-auth/providers';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const githubCredentialsProvided = process.env.GITHUB_ID && process.env.GITHUB_SECRET;
const googleCredentialsProvided = process.env.GOOGLE_ID && process.env.GOOGLE_SECRET;

const providers = [
  githubCredentialsProvided &&
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
  googleCredentialsProvided &&
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    })
];

const options: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: providers.filter(Boolean) as Provider[],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    signIn: async function signInCallback(data: any) {
      try {
        await axios.post(`${process.env.NEXTAUTH_URL}/api/users/sign-in`, {user: data.user, account: data.account});
        return Promise.resolve(true);
      } catch (error) {
        console.error(error);
        return Promise.reject({data: {message: 'User not found'}});
      }
    },
    session: async function session({session}: any) {
      const user = await db.user.findUnique({where: {email: session.user.email}});
      session.user.id = user?.id;
      session.user.organizationId = user?.organizationId;
      return session;
    }
  },
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/sign-in'
  }
};
