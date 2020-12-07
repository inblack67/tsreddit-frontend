import { useState, Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Preloader from '../components/Preloader';
import { LoginInterface } from '../src/interfaces';
import { GetMeDocument, GetMeQuery, useLoginMutation, useHelloQuery } from '../src/generated/graphql';


const Login = () =>
{
    const router = useRouter();
    const [ submitting, setSubmitting ] = useState( false );

    const { register, handleSubmit, errors } = useForm<LoginInterface>( {
        defaultValues: {
            email: 'aman@gmail.com',
            password: "12345678"
        }
    } );

    const [ loginUser, { loading, error, data } ] = useLoginMutation();

    const helloRes = useHelloQuery();

    useEffect( () =>
    {
        if ( error )
        {
            M.toast( { html: error.message } );
        }
    }, [ error ] );

    console.log( 'hello', helloRes.data );

    const onLogin = ( data: LoginInterface ) =>
    {
        setSubmitting( true );
        loginUser( {
            variables: data,
            update: ( cache, { data } ) =>
            {
                cache.writeQuery<GetMeQuery>( {
                    query: GetMeDocument,
                    data: {
                        __typename: 'Query',
                        getMe: data?.login
                    }
                } );
                cache.evict( { fieldName: 'posts:{}' } );
            }
        } ).then( () =>
        {
            M.toast( { html: 'Login Successful' } );
            if ( typeof router.query.next === 'string' )
            {
                router.push( `${ router.query.next }` );
            }
            else
            {
                router.push( '/' );
            }
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
                <p className='flow-text center'>Login</p>
                <form onSubmit={ handleSubmit( onLogin ) }>
                    <div className='input-field'>
                        <input
                            type='email'
                            name='email'
                            ref={ register( {
                                required: 'Required!',
                            } ) }
                        />
                        <label htmlFor='email' />
                        { errors.email ? (
                            <span className='helper-text red-text'>{ errors.email.message }</span>
                        ) : (
                                <span className='helper-text white-text'>Email</span>
                            ) }
                    </div>
                    <div className='input-field'>
                        <input
                            type='password'
                            name='password'
                            ref={ register( {
                                required: 'Required!',
                            } ) }
                        />
                        <label htmlFor='password' />
                        { errors.password ? (
                            <span className='helper-text red-text'>{ errors.password.message }</span>
                        ) : (
                                <span className='helper-text white-text'>Password</span>
                            ) }
                    </div>
                    <div className='input-field'>
                        <button type='submit' className='btn red' disabled={ submitting }>
                            Login
						</button>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};


export default Login;
