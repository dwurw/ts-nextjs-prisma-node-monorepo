import {QueryClient, useMutation as useMutationReactQuery, useQueryClient} from 'react-query';
import axios from '../axios';
import uuid from 'react-uuid';
import {getMutationDef, Model, Mutation} from './definitions';

/**
 * This hook is a wrapper around react-query's useMutation hook.
 * It allows to manage all endpoint definitions for a single place in a simple manner and adding some convenience for working with the library.
 * Also big advantage is generic optimistic updates that works automatically.
 */
export default function useMutation({type, keyVars, successMsg, loadingMsg, errorMsg}: Mutation) {
  const queryClient = useQueryClient();

  const mutationDef = getMutationDef(type);

  const messageKey = uuid();

  return useMutationReactQuery(
    async variables => {
      const {data} = await axios({
        method: mutationDef.method,
        url: mutationDef.customRoute || `/${mutationDef.model}`,
        data: variables
      });
      return data;
    },
    {
      onMutate: (variables: any) => {
        // if (loadingMsg) message.loading({content: loadingMsg, key: messageKey, duration: 0});

        if (mutationDef.skipOptimisticUpdate) return;

        if (mutationDef.method === 'DELETE') {
          return onDeleteMutate(queryClient, variables, mutationDef.model, keyVars);
        }

        return mutationDef.bulk
          ? onBulkCreateOrUpdateMutate(queryClient, variables, mutationDef.model, keyVars)
          : onCreateOrUpdateMutate(queryClient, variables, mutationDef.model, keyVars);
      },
      onSuccess: () => {
        // if (successMsg) message.success({content: successMsg, key: messageKey});

        queryClient.invalidateQueries([mutationDef.model, keyVars]);
      },
      onError: (error, _, context) => {
        // if (errorMsg) message.error({content: error, key: messageKey});
        console.error({content: `Error: Mutation ${type} cannot be completed`, key: messageKey});
        console.error(error);

        if (mutationDef.skipOptimisticUpdate) return;

        if (mutationDef.method === 'DELETE') {
          return onDeleteError(queryClient, context, mutationDef.model, keyVars);
        }

        return mutationDef.bulk
          ? onCreateOrUpdateBulkError(queryClient, context, mutationDef.model, keyVars)
          : onCreateOrUpdateError(queryClient, context, mutationDef.model, keyVars);
      }
    }
  );
}

function onBulkCreateOrUpdateMutate<ObjectType extends {id?: string}>(
  queryClient: QueryClient,
  variables: any[],
  model: Model,
  keyVars?: object
) {
  const optimisticItems = variables.map(item => {
    if (item.id) return item;
    return {...item, id: uuid()};
  });

  queryClient.setQueryData<any>([model, keyVars], (items: ObjectType[]) => {
    if (!items) {
      return [];
    }
    optimisticItems.forEach(optimisticItem => {
      const foundIndex = items.findIndex(x => x.id === optimisticItem.id);
      if (foundIndex >= 0) {
        items[foundIndex] = {...items[foundIndex], ...optimisticItem};
      } else {
        items.push(optimisticItem);
      }
    });
    return items;
  });
  return optimisticItems;
}

function onCreateOrUpdateMutate<ObjectType extends {id: string}>(queryClient: QueryClient, variable: any, model: Model, keyVars?: object) {
  const optimisticItem = {...variable};
  if (!optimisticItem.id) optimisticItem.id = uuid();

  queryClient.setQueryData<any>([model, keyVars], (items: ObjectType[]) => {
    if (!items) {
      return [];
    }
    const foundIndex = items.findIndex(x => x.id === optimisticItem.id);
    if (foundIndex >= 0) {
      items[foundIndex] = {...items[foundIndex], ...optimisticItem};
    } else {
      items.push(optimisticItem);
    }
    return items;
  });

  return optimisticItem;
}

function onCreateOrUpdateBulkError<ObjectType extends {id?: string}>(
  queryClient: QueryClient,
  optimisticItems: any[],
  model: Model,
  keyVars?: object
) {
  queryClient.setQueryData<any>([model, keyVars], (items: ObjectType[]) => {
    optimisticItems.forEach(optimisticItem => {
      const foundIndex = items.findIndex(x => x.id === optimisticItem.id)!;
      items.splice(foundIndex, 1);
    });
  });
}

function onCreateOrUpdateError<ObjectType extends {id: string}>(
  queryClient: QueryClient,
  optimisticItem: any,
  model: Model,
  keyVars?: object
) {
  queryClient.setQueryData<any>([model, keyVars], (items: ObjectType[]) => {
    return items.filter(x => x.id !== optimisticItem.id);
  });
}

function onDeleteMutate<ObjectType extends {id: string}>(queryClient: QueryClient, variable: any, model: Model, keyVars?: object) {
  const optimisticItem = {...variable};
  queryClient.setQueryData<any>([model, keyVars], (items: ObjectType[]) => {
    return items.filter(x => x.id !== optimisticItem.id);
  });
  return optimisticItem;
}

function onDeleteError<ObjectType extends {id: string}>(queryClient: QueryClient, variable: any, model: Model, keyVars?: object) {
  const optimisticItem = {...variable};
  queryClient.setQueryData<any>([model, keyVars], (items: ObjectType[]) => {
    if (!items) {
      return [];
    }
    const foundIndex = items.findIndex(x => x.id === optimisticItem.id);
    if (foundIndex >= 0) {
      items[foundIndex] = {...items[foundIndex], ...optimisticItem};
    } else {
      items.push(optimisticItem);
    }
    return items;
  });
  return optimisticItem;
}
