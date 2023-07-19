import moment from 'moment';

export default function formatDate (date: string): string {
  return moment(date).format('MMM DD, YYYY');
};
