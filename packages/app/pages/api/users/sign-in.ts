import type {NextApiRequest, NextApiResponse} from 'next';
import db from '../../../libs/prisma';

export default async function signIn(req: NextApiRequest, res: NextApiResponse) {
  const {user: userData, account: accountData} = req.body;
  if (!userData?.email) res.status(400).send({error: 'User email is required.'});
  if (!accountData?.providerAccountId) res.status(400).send({error: 'Provider Id is required.'});


  try {
    const user = await db.user.findUnique({where: {email: userData.email}});

    if (user) {
      await db.user.update({where: {id: user.id}, data: {name: userData.name, image: userData.image}});
      const accounts = await db.account.findMany({where: {userId: user.id}});
      const currentAccount = accounts.find(account => account.providerAccountId === accountData.providerAccountId);
      if (!currentAccount) {
        await db.account.create({
          data: {
            userId: user.id,
            type: accountData.type,
            provider: accountData.provider,
            providerAccountId: accountData.providerAccountId,
            token_type: accountData.token_type,
            access_token: accountData.access_token,
            scope: accountData.scope
          }
        });
      }
    } else {
      res.status(404).send('User does not exist.');
    }
    res.status(200).send(true);
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong.');
  }
}
