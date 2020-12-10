import '../styles/globals.css';

function MyApp ( { pageProps, Component } )
{
	return (
		<Component { ...pageProps } />
	);
}

export default MyApp;
