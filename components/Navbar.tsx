import Link from 'next/link';
import { useLogoutMutation, useGetMeQuery } from '../src/generated/graphql';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { Fragment, useEffect } from 'react';
import { isServer } from '../src/utils/constants';

const Navbar = () =>
{
	const router = useRouter();
	const apollo = useApolloClient();

	const [ logoutUser, { error } ] = useLogoutMutation();
	const { loading, data } = useGetMeQuery( {
		skip: isServer()
	} );

	useEffect( () =>
	{
		if ( error )
		{
			M.toast( { html: error.message } );
		}
	}, [ error ] );

	const onClick = async ( _: React.MouseEvent<HTMLAnchorElement, MouseEvent> ) =>
	{
		try
		{
			await logoutUser( {
				update: ( cache ) =>
				{
					cache.evict( { fieldName: 'getMe' } );
				}
			} );
			if ( !error )
			{
				M.toast( { html: 'Logged Out!' } );
				router.push( '/login' );
			}
			await apollo.resetStore();
		} catch ( err )
		{

		}
	};


	let navLinks = null;

	if ( loading )
	{
		navLinks = null;
	}
	else if ( !data?.getMe )
	{
		navLinks = <ul className='right'>
			<li>
				<Link href='/login'>
					<a>Login</a>
				</Link>
			</li>
			<li>
				<Link href='/register'>
					<a>Register</a>
				</Link>
			</li>
		</ul>;
	}
	else
	{
		navLinks = <ul className='right'>
			<li>
				<span className="red-text">
					{ data.getMe.name }
				</span>
			</li>
			<li>
				<a href="#!" onClick={ onClick }>Logout</a>
			</li>
		</ul>;
	}

	return (
		<nav className='black'>
			<div className='nav-wrapper'>
				<div className='container'>
					<Link href='/'>
						<a>Next.js</a>
					</Link>
					{ navLinks }
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
