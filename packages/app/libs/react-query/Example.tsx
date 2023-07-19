import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useMutation, useQueries} from '../../libs/react-query';
import useConfigurationStore from '../../stores/useConfigurationStore';
import {type} from 'os';
import {User} from '@fluxusform/prisma';

type QueryData = {
  users: Map<string, User>;
};

export default function Example() {
  const {activeProjectId: projectId} = useConfigurationStore();

  // This will create a GET request to /users?id=projectId
  // The request will not be made until projectId is defined
  // useQueries will convert array of users to Map<string, User> automatically.
  // Fetched data will be stored automatically in react-query cache under "modelName_variables" key.
  const {data: {users}} = useQueries<QueryData>([{type: 'getUsers', variables: {id: projectId}, mapKey: 'id', isEnabled: Boolean(projectId)}]);

  const usersMutation = useMutation({type: 'updateUsers', keyVars: {projectId}});

  // This will create a POST request to /users
  // Using model name from Mutation definitions and passed keyVars props,
  // it will automatically perform optimistic update on the cache.
  // If you request fails, it will automatically revert the cache to previous state.
  function handleUsersUpdate(updatedUsers: User[]) {
    usersMutation.mutate(updatedUsers);
  }

  useEffect(() => {
    if (usersMutation.data) {
      // Do something on successful mutation
    }
    if (usersMutation.error) {
      // Do something on error
    }
  }, [usersMutation.data, usersMutation.error]);

  return <div>...</div>;
}
function push(arg0: string) {
  throw new Error('Function not implemented.');
}

