import {useQueries as useQueriesReactQuery} from 'react-query';
import axios from '../axios';
import {getQueryDef, UseQueriesResponse, Query} from './definitions';

/**
 * This hook is a wrapper around react-query's useQueries hook.
 * It allows to manage all endpoint definitions for a single place in a simple manner and adding some convenience for working with the library.
 * Also big advantage is generic optimistic updates that works automatically.
 */
function useQueries<DataObject>(queries: Query[]): UseQueriesResponse<DataObject> {
  const results = useQueriesReactQuery(
    queries.map(({type, variables, isEnabled, pollingInterval}) => {
      const queryDef = getQueryDef(type);
      return {
        queryKey: [queryDef.model, variables],
        queryFn: async (): Promise<string> => {
          const {data} = await axios.get(
            `${queryDef.customRoute || `/${queryDef.model}`}${variables ? `?${new URLSearchParams(variables as any).toString()}` : ''}`
          );
          return data;
        },
        refetchInterval: pollingInterval,
        onError: (error: string) => {
          console.error({content: `Error: Query "${type}" can't be loaded.`, key: type});
          console.error(error);
        },
        enabled: isEnabled === false ? isEnabled : true
      };
    })
  );

  const data: any = {};

  results.forEach((result: any, i) => {
    const query = queries[i];
    const queryDef = getQueryDef(query.type);

    if (result.data) {
      if (query.mapKey) {
        data[queryDef.model] = new Map(result.data.map((item: any) => [item?.[query.mapKey!], item]));
      } else {
        data[queryDef.model] = result.data;
      }
    } else {
      return [];
    }
  });

  return {
    data,
    loading: results.some(r => r.isLoading)
  };
}

export default useQueries;
