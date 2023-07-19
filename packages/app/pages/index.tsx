import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';


const Dashboard: NextPage = () => {
  const session = useSession();

  return (
      <div className="bg-white">
        Homepage
      </div>
  );
};

export default Dashboard;
