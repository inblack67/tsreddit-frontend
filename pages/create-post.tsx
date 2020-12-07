import { useState, Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Preloader from '../components/Preloader';
import { useCreatePostMutation } from '../src/generated/graphql';
import { CreatePostInterface } from '../src/interfaces';

const CreatePost = () =>
{
    const router = useRouter();
    const [ submitting, setSubmitting ] = useState( false );

    const { register, handleSubmit, errors } = useForm<CreatePostInterface>( {
        defaultValues: {
            title: 'some title',
            text: "some text"
        }
    } );

    const [ createPost, { loading, error } ] = useCreatePostMutation();

    useEffect( () =>
    {
        if ( error )
        {
            M.toast( { html: error.message } );
        }
    }, [ error ] );

    const onCreatePost = ( data: CreatePostInterface ) =>
    {
        setSubmitting( true );
        createPost( {
            variables: data,
            update: ( cache ) =>
            {
                cache.evict( {
                    fieldName: `posts:{}`
                } );
            }
        } ).then( () =>
        {
            M.toast( { html: 'Post Created' } );
            router.push( '/' );
        } ).catch( err => console.error( err ) );
        setSubmitting( false );
    };

    if ( loading )
    {
        return <Preloader />;
    }

    return (
        <Fragment>
            <div className='container'>
                <p className='flow-text center'>Create Post</p>
                <form onSubmit={ handleSubmit( onCreatePost ) }>
                    <div className='input-field'>
                        <input
                            type='text'
                            name='title'
                            ref={ register( {
                                required: 'Required!',
                            } ) }
                        />
                        <label htmlFor='title' />
                        { errors.title ? (
                            <span className='helper-text red-text'>{ errors.title.message }</span>
                        ) : (
                                <span className='helper-text white-text'>Title</span>
                            ) }
                    </div>
                    <div className='input-field'>
                        <input
                            type='text'
                            name='text'
                            ref={ register( {
                                required: 'Required!',
                            } ) }
                        />
                        <label htmlFor='text' />
                        { errors.text ? (
                            <span className='helper-text red-text'>{ errors.text.message }</span>
                        ) : (
                                <span className='helper-text white-text'>Text</span>
                            ) }
                    </div>
                    <div className='input-field'>
                        <button type='submit' className='btn red' disabled={ submitting }>
                            Create
						</button>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};


export default CreatePost;
