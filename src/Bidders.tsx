import { useRealtime } from 'react-supabase'
import { supabase } from './supabaseClient'
import React, { useEffect, useState } from 'react';
import { BidUpdate } from './BidUpdate';
import { User } from '@supabase/supabase-js';
import { NameUpdate } from './NameUpdate';
import { bidToEmoji } from './bidUtils';
import { Tickets } from './Tickets';

const Bidders = ({ loggedInUser: user }: { loggedInUser: User | null }) => {
    const [keepAliveId, setKeepAlive] = useState(setTimeout(supabase.auth.signOut, 20 * 60000))
    useEffect(() => {
        const nIntervId = setInterval(pingFibbers, 30000);
        pingFibbers();
        return () => { clearInterval(nIntervId); }
    }, [])

    const pingFibbers = async () => {
        if (user?.id) { 
            await supabase.from("fibbers").update({ updated_at: new Date(new Date(Date.now()).toUTCString()).toISOString() }).eq('id', user?.id);
        }
    }

    const renewKeepAlive = () => {
        if (keepAliveId) clearTimeout(keepAliveId)
        setKeepAlive(setTimeout(supabase.auth.signOut, 20 * 60000))
    }
    const aMinuteAgo = new Date(new Date(Date.now() - 60000).toUTCString()).toISOString()
    const activeFibber = (lastUpdated: string | null, name: string) => {
        if (!lastUpdated) return false;
        const lastUp = new Date(new Date(Date.parse(lastUpdated ?? "")).toUTCString()).toISOString();
        const aMinuteAgo = new Date(new Date(Date.now() - 60000).toUTCString()).toISOString()
        const isActiveFibber = lastUp > aMinuteAgo;
        console.log(":) lastUpdate > aMinuteAgo ", lastUp, ">", aMinuteAgo, "-> isActiveFibber", isActiveFibber, name);
        return isActiveFibber;
    }

    const [{ data: rtBids, error: bidError }] = useRealtime('fibbers', {
        select: {
            columns: 'id,updated_at,name,bid',
            filter: (query) => query.gt('updated_at', aMinuteAgo),
        },
    })
    const me: { id: string, name: string, bid: number } | null = rtBids?.reduce((acc, p) => (p.id === user?.id) ? p : acc, null)
    const fibbersOnline: { id: string, name: string, bid: number }[] | undefined = rtBids?.filter((p) => activeFibber(p.updated_at, p.name))

    const [{ data: rtTickets, error: ticketError }] = useRealtime('tickets', {
        select: {
            columns: 'id,desc,bid,status',
        },
    })
    if (!me || !rtBids) return null;

    const biddingTicket: boolean = rtTickets?.filter((t) => (t.status === 'BIDDING')).length === 1
    const debateTicket: boolean = rtTickets?.filter((t) => (t.status === 'DEBATE')).length === 1
    const canDebate = biddingTicket && fibbersOnline?.filter((f) => f.bid === 0).length === 0;

    return (
        <div className="container">
            <ul className="list-group narrow">
                {
                    fibbersOnline ? fibbersOnline.map((p: {
                        id: string, name: string, bid: number
                    }) => (
                        <li key={p.id}>
                            {
                                user?.id === p.id ? <>
                                    <span className="badge-person2">{p.name}</span> My Bid
                                    <BidUpdate table={"fibbers"} id={p.id} initBid={p.bid} disabled={debateTicket} keepAlive={renewKeepAlive} /></>
                                    :
                                    <span className="badge-person1">{p.name}</span>
                            }
                        </li>
                    )) : null}
            </ul>

            <ul className="list-group slim"> {
                fibbersOnline?.map((p: { id: string, name: string, bid: number }) => (
                    <li key={p.id}>
                        {biddingTicket || !debateTicket ?
                            <span className={`badge${p.bid ? 1 : 8}`}>{p.bid ? "#" : "🤷"}</span> : null // ✨🃏
                        }
                        {debateTicket ?
                            <span className={`badge${p.bid ?? 0}`}>{bidToEmoji(p.bid) ?? "😥"}</span> : null
                        }
                    </li>
                ))}
            </ul>
            <Tickets canDebate={canDebate} rtTickets={rtTickets} user={user} biddingTicket={biddingTicket} debateTicket={debateTicket} keepAlive={renewKeepAlive} />
            <div>
                {user ?
                    <NameUpdate initName={me?.name ?? user?.email?.split('@')[0] ?? "blah"} user={user} />
                    : null
                }
            </div>
            <div></div>


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