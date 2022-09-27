import React from 'react';
import Auth from './Auth'
import Bidders from './Bidders'
// import { useAuth } from './useAuth'
import { supabase } from './supabaseClient'

const AuthRouter = () => {
    // const { session, user: _user } = useAuth()
    const user = supabase.auth.user();    

    if (!user) return (<Auth />);

    return (<Bidders loggedInUser={user} />);
}

export default AuthRouter