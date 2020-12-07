import Layout from '../components/Layout';
import '../styles/globals.css';
import { useApollo } from '../src/apollo';
import { ApolloProvider } from '@apollo/client';


function MyApp ( { Component, pageProps } )
{
	const apolloClient = useApollo( pageProps.initialApolloState );

	return (
		<ApolloProvider client={ apolloClient }>
			<Layout>
				<Component { ...pageProps } />
			</Layout>
		</ApolloProvider>

	);
}
export default MyApp;
