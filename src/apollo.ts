import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { PaginatedPosts } from '../src/generated/graphql';


let apolloClient: ApolloClient<NormalizedCacheObject>;

function createIsomorphLink ()
{
    const { HttpLink } = require( '@apollo/client/link/http' );

    const httpLink = new HttpLink( {
        uri: `${ process.env.NEXT_PUBLIC_SERVER_URL }/graphql`,
        credentials: 'include',
    } );

    return httpLink;
}

const errorLink = onError( ( { graphQLErrors, networkError } ) =>
{
    if ( graphQLErrors )
    {
        graphQLErrors.map( ( { message, locations, path } ) =>
        {
            console.log( `[GraphQL error]: Message: ${ message }, Location: ${ locations }, Path: ${ path }` );
            // if ( message.includes( 'Not Authenticated' ) )
            // {
            //     M.toast( { html: 'You must login first!' } );
            //     Router.replace( '/login' );
            // }
        } );
    }

    if ( networkError )
    {
        console.log( `[Network error]: ${ networkError }` );
    }
} );


function createApolloClient ()
{
    return new ApolloClient( {
        ssrMode: typeof window === 'undefined',
        link: errorLink.concat( createIsomorphLink() ),
        credentials: 'include',
        cache: new InMemoryCache( {
            typePolicies: {
                Query: {
                    fields: {
                        posts: {
                            keyArgs: [],
                            merge ( existing: PaginatedPosts | undefined, incoming: PaginatedPosts )
                            {
                                return {
                                    __typename: 'PaginatedPosts',
                                    hasMore: incoming.hasMore,
                                    posts: [ ...( existing?.posts || [] ), ...incoming.posts ]
                                };
                            }
                        }
                    }
                }
            }
        } ),

    } );
}

export function initializeApollo ( initialState = null )
{
    const _apolloClient = apolloClient ?? createApolloClient();

    if ( initialState )
    {
        _apolloClient.cache.restore( initialState );
    }

    if ( typeof window === 'undefined' ) return _apolloClient;

    if ( !apolloClient ) apolloClient = _apolloClient;

    return _apolloClient;
}

export function useApollo ( initialState: any )
{
    const store = useMemo( () => initializeApollo( initialState ), [ initialState ] );
    return store;
}