import { useRouter } from 'next/router';
import { useState, Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Preloader from '../components/Preloader';
import { useRegisterMutation, GetMeQuery, GetMeDocument } from '../src/generated/graphql';
import { RegisterInterface } from '../src/interfaces';

const Register = () =>
{
    const router = useRouter();

    const [ submitting, setSubmitting ] = useState( false );

    const { register, handleSubmit, errors } = useForm<RegisterInterface>( {
        defaultValues: {
            name: 'Aman',
            email: 'aman@gmail.com',
            password: "Aman123@"
        }
    } );

    const [ registerUser, { loading, data, error } ] = useRegisterMutation();

    useEffect( () =>
    {
        if ( error )
        {
            M.toast( { html: error.message } );
        }
    }, [ error ] );

    const onRegister = ( data: RegisterInterface ) =>
    {
        setSubmitting( true );
        registerUser( {
            variables: data,
            update: ( cache, { data } ) =>
            {
                cache.writeQuery<GetMeQuery>( {
                    query: GetMeDocument,
                    data: {
                        __typename: 'Query',
                        getMe: data?.register
                    }
                } );
            }
        } ).then( () =>
        {
            M.toast( { html: 'Registration Successful!' } );
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
                <p className='flow-text center'>Register</p>
                <form onSubmit={ handleSubmit( onRegister ) }>
                    <div className='input-field'>
                        <input
                            type='text'
                            name='name'
                            ref={ register( {
                                required: 'Required!',
                            } ) }
                        />
                        <label htmlFor='name' />
                        { errors.name ? (
                            <span className='helper-text red-text'>{ errors.name.message }</span>
                        ) : (
                                <span className='helper-text white-text'>Name</span>
                            ) }
                    </div>
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
                                minLength: {
                                    value: 8,
                                    message: 'Must be 8 chars',
                                },
                                maxLength: {
                                    value: 16,
                                    message: 'Cannot exceed 16 chars',
                                },
                                validate: ( value ) =>
                                {
                                    return (
                                        [ /[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/ ].every( ( pattern ) =>
                                            pattern.test( value ),
                                        ) || 'Must include lower, upper, number, and special chars'
                                    );
                                },
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
                            Register
						</button>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default Register;
