export interface Query {
  /** Query type (Type of your request) All query requests are considered as GET */
  type: QueryType;
  /** Query variables. They would be converted to query string. (Variables of your request) */
  variables?: object;
  /** If parameter is provided, result will be returned as a Map Collection */
  mapKey?: string;
  /** IF parameter is provided, endpoint will be polled (in milliseconds) */
  pollingInterval?: number;
  /** If false, API call will not be fired. Default = true */
  isEnabled?: boolean;
}

export interface Mutation {
  /** Mutation type (Type of your request) */
  type: MutationType;
  /** Variables that has been used for fetching this specific query (Used for optimistic updates) */
  keyVars?: object;
  /** Message that will be shown right after mutation started */
  loadingMsg?: string;
  /** Message that will be shown after successful mutation */
  successMsg?: string;
  /** Message that will be shown if request fails */
  errorMsg?: string;
}

export interface IQueryDef {
  /** Model type that you are mutating. (Used for optimistic updates) */
  model: Model;
  /** Custom path to the endpoint. Default - model name */
  customRoute?: string;
}

export interface IMutationDef {
  /** Model type that you are mutating. (Used for optimistic updates) */
  model: Model;
  /** Type will define REST request method. For GET - use Query instead of Mutation */
  method: 'POST' | 'PUT' | 'DELETE';
  /** Disables optimistic updates. Default = false.  */
  skipOptimisticUpdate?: boolean;
  /** Should be passed true, if data represented by array. Default = false. (Used for optimistic updates)  */
  bulk?: boolean;
  /** Custom path to the endpoint. Default - model name */
  customRoute?: string;
}

export interface UseQueriesResponse<DataObject> {
  /** Requested data */
  data: DataObject;
  /** True if at least one of the queries is still loading */
  loading: boolean;
}

export type Model = 'projects' | 'users';

export type QueryType = 'getProjects' | 'getUsers';

export type MutationType =
  | 'createProject'
  | 'updateProject'
  | 'updateProjects'
  | 'createUser'
  | 'updateUsers'


/**
 * @param type
 * @returns Full query definition based on Query type
 */
export function getQueryDef(type: QueryType): IQueryDef {
  switch (type) {
    case 'getProjects':
      return {model: 'projects'};
    case 'getUsers':
      return {model: 'users'};
    default:
      throw new Error('Mutation is not implemented');
  }
}

/**
 * @param type
 * @returns Full mutation definition based on Mutation type
 */
export function getMutationDef(type: MutationType): IMutationDef {
  switch (type) {
    case 'createProject':
      return {
        model: 'projects',
        method: 'POST',
      };
    case 'updateProject':
      return {
        model: 'projects',
        method: 'PUT',
      };
    case 'updateProjects':
      return {
        model: 'projects',
        method: 'PUT',
        customRoute: 'projects/bulk-update',
        bulk: true,
      };
    case 'createUser':
      return {
        model: 'users',
        method: 'POST',
      };
      case 'updateUsers':
        return {
          model: 'users',
          method: 'PUT',
          bulk: true,
        };
    default:
      throw new Error('Mutation is not implemented');
  }
}
