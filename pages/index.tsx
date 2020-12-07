import Link from 'next/link';
import { Fragment, useEffect } from 'react';
import PostItem from '../components/PostItem';
import Preloader from '../components/Preloader';
import { usePostsQuery, PostsQuery } from '../src/generated/graphql';
import { useIsAuth } from '../src/utils/customHooks';


const index = () =>
{
	const authenticatedUser = useIsAuth();
	const { loading, error, data, fetchMore, variables } = usePostsQuery( {
		variables: {
			limit: 5,
			cursor: null
		},
		notifyOnNetworkStatusChange: true,
		ssr: true,
	} );



	useEffect( () =>
	{
		if ( error )
		{
			M.toast( { html: error.message } );
		}
	}, [ error, loading ] );

	if ( loading )
	{
		return <Preloader />;
	}


	const onFetchMorePosts = () =>
	{
		fetchMore( {
			variables: {
				limit: variables.limit,
				cursor: data?.posts.posts[ data.posts.posts.length - 1 ].createdAt
			}
		} );
	};

	return (
		<div className='container'>
			<div className="center">
				<p className="flow-text">Posts</p>
				<div>
					<Link href='create-post'>
						<a href='#!' className="btn green">Create Post</a>
					</Link>
				</div>
				{ data && data.posts && <Fragment>
					<div className="row">
						{ data.posts.posts.map( post => <PostItem user={ authenticatedUser } key={ post.id } post={ post } /> ) }
					</div>
					{ data.posts.hasMore ? <div className='input-field center'>
						<button onClick={ onFetchMorePosts } className="red btn-small">Fetch More</button>
					</div> : <p className="flow-text red-text center">The End.?</p> }
				</Fragment> }
			</div>
		</div>
	);
};

export default index;
