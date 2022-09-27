import { useRealtime, useUpdate } from 'react-supabase'
import { supabase } from './supabaseClient'
import React, { useState } from 'react';
import BidUpdate from './BidUpdate';
import { User } from '@supabase/supabase-js';

const Bidders = ({ loggedInUser }: { loggedInUser: User | null }) => {
    const user = loggedInUser
    //const [loading, setLoading] = useState(true)
    const [name, setName] = useState(null as string | null)
    
    // const [{ count, data, error: errorUpdate, fetching }, execute] = useUpdate('fibbers', {
    //     filter: (query) => query.eq('id', '5d95e2ac-f615-4e16-b9f5-1b660d36fc44'),
    // })
    // console.log("useUpdate count, errorUpdate, data, fetching", count, errorUpdate, data, fetching);

    const [{ data: rtd, error }] = useRealtime('fibbers', {
        select: {
            columns: 'id,name,bid',
        },
    })
    console.log("rtd", rtd)

    // async function updateFibber() {
    //     console.log("updateFibber", name, bid);

    //     const { count, data, error } = await execute(
    //         { bid, name },
    //         (query) => query.eq('id', '5d95e2ac-f615-4e16-b9f5-1b660d36fc44'),
    //     )
    //     console.log("update error", count, error, data);
    // }


    // const rtd = supabase
    //     .from('fibbers')
    //     .on('*', payload => {
    //         console.log('Change received!', payload)
    //     })
    //     .subscribe()

    // const updateFibbers = async (e: { preventDefault: () => void; }) => {
    //     e.preventDefault()

    //     try {
    //         setLoading(true)

    //         const updates = {
    //             id: user.id,
    //             name,
    //             bid,
    //             updated_at: new Date(),
    //         }

    //         let { error } = await supabase.from('profiles').upsert(updates)

    //         if (error) {
    //             throw error
    //         }
    //     } catch (error) {
    //         if (error) {
    //             const e = error as { message: string };
    //             alert(e.message)
    //         }
    //     } finally {
    //         setLoading(false)
    //     }
    // }

console.log("user", user);

    return (
        <div className="container">
            <div>
                <ul className="list-group">
                    {
                        rtd ? rtd.map((p: { id: string, name: string, bid: number }) => (
                            <li key={p.id}>{p.name}
                                {
                                    user?.id === p.id ? 
                                    <>
                                    <span className="badge">{p.bid ? p.bid : "?"}</span>
                                    <BidUpdate id={p.id} initBid={p.bid} /> 
                                    </> : 
                                    <span className="badge">{p.bid ? p.bid : "?"}</span>
                                }
                            </li>
                        )) : null}
                </ul>
            </div>

            <p></p>

            <div>
                {/* <form onSubmit={updateFibber} className="form-widget" id="update-profile">
                    <div>Email: {session.user.email}</div>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name || ''}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <button className="button primary block" type="submit" >
                            Update profile
                        </button>
                    </div>
                </form> */}
            </div>

            <p>
                <button
                    type="button"
                    className="button block"
                    onClick={() => supabase.auth.signOut()}
                >
                    Sign Out
                </button>
            </p>
        </div>
    )
}

export default Bidders