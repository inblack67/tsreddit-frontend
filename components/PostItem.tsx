import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormatDate from './FormatDate';
import { useDeletePostMutation, useVoteMutation } from '../src/generated/graphql';
import { gql } from '@apollo/client';

const PostItem = ( { post: { title, id, text, points, creatorId, createdAt, creator: { name } }, user } ) =>
{
    const [ deletePost, deletePostRes ] = useDeletePostMutation();

    const [ voteIt, voteRes ] = useVoteMutation();

    useEffect( () =>
    {
        if ( deletePostRes.error )
        {
            M.toast( { html: deletePostRes.error.message } );
        }
    }, [ deletePostRes.error, deletePostRes.loading ] );

    useEffect( () =>
    {
        if ( voteRes.error )
        {
            M.toast( { html: voteRes.error.message } );
        }
    }, [ voteRes.error, voteRes.loading ] );

    const onDeletePost = () =>
    {
        deletePost( {
            variables: {
                id
            },
            update: ( cache ) =>
            {
                cache.evict( {
                    id: `Post:${ id }`,
                } );
            }
        } ).then( ( data ) =>
        {
            if ( data.data.deletePost )
            {
                M.toast( { html: 'Post Deleted!' } );
            }
            else
            {
                M.toast( { html: 'Failed!' } );
            }
        } ).catch( err => console.error( err ) );
    };

    const onUpvote = () =>
    {
        voteIt( {
            variables: {
                postId: id,
                value: 1
            },
            update: ( cache ) =>
            {
                const data = cache.readFragment<{
                    id: number,
                    points: number,
                    voteStatus: number | null;
                }>( {
                    id: `Post:${ id }`,
                    fragment: gql`
                    fragment _ on Post{
                        id,
                        points, 
                        voteStatus
                    }
                    `
                } );
                if ( data.voteStatus === 1 )
                {
                    return;
                }

                const newPoints = data.points + 1;

                cache.writeFragment( {
                    id: `Post:${ id }`,
                    fragment: gql`
                    fragment _ on Post{
                        id,
                        points, 
                        voteStatus
                    }
                    `,
                    data: { points: newPoints, voteStatus: 1 }
                } );
            }
        } ).then( data =>
        {
            console.log( data );
        } ).catch( err => console.error( err ) );
    };


    return (
        <div className="card grey darken-4">
            <div className="card-content">
                <span className="card-title">
                    { title }
                </span>
                <p>
                    { text }
                </p>
                <p className="green-text">
                    { points } Points
                </p>
                { ( user && ( user.id === creatorId ) ) ?
                    <a href="#!" className='red-text' onClick={ onDeletePost }>
                        Delete
                        </a> : null
                }
            </div>
            <div className="card-action">
                <a href="#!">
                    By { name }
                </a>
                <a href="#!" className='blue-text'>
                    <FormatDate createdAt={ createdAt } />
                </a>
                <a href="#!" className='grey-text' onClick={ onUpvote }>
                    Upvote
                </a>
            </div>
        </div>
    );
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};

export default PostItem;
