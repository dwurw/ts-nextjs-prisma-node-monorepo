export type IColor = 'red' | 'yellow' | 'green' | 'indigo' | 'blue' | 'purple' | 'grey';
export type ISize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

export type ISession = {
  user?: {
    id: string;
    name: string,
    email: string,
    image: string
    organizationId: string,
  },
  expires?: string
};