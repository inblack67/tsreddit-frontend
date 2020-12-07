import { ApolloClient, InMemoryCache } from '@apollo/client';
import { withApollo as createWithApollo } from 'next-apollo';

const apolloClient = new ApolloClient( {
    uri: `${ process.env.NEXT_PUBLIC_SERVER_URL }/graphql`,
    credentials: 'include',
    cache: new InMemoryCache()
} );

export const withApollo = createWithApollo( apolloClient );