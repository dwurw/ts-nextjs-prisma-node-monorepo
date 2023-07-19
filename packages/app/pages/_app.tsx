import {SessionProvider} from 'next-auth/react';
import type {AppProps} from 'next/app';
import {useEffect} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {createWebStoragePersistor} from 'react-query/createWebStoragePersistor-experimental';
import {persistQueryClient} from 'react-query/persistQueryClient-experimental';
import '../styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      // After 30 seconds of inactivity data will be refetched
      staleTime: 1000 * 30 * 1,
      // After 24 hours data will be removed & garbage collected
      cacheTime: 1000 * 60 * 60 * 24,
      refetchOnMount: true
    }
  }
});

function Application({Component, pageProps: {session, ...pageProps}}: AppProps) {
  useEffect(() => {
    persistQueryClient({
      queryClient,
      persistor: createWebStoragePersistor({storage: window?.localStorage})
    });
  });

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default Application;
