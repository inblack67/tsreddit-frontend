import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGetMeQuery } from "../generated/graphql";
import { isServer } from "./constants";

export const useIsAuth = () =>
{
    const { loading, data, error } = useGetMeQuery( {
        skip: isServer()
    } );
    const router = useRouter();
    useEffect( () =>
    {
        if ( !loading && error )
        {
            M.toast( { html: error.message } );
            router.replace( `/login?next=${ router.pathname }` );
        }
    }, [ loading, data, router ] );
    return data && data.getMe;
};