import { useRealtime } from 'react-supabase'
import { supabase } from './supabaseClient'
import React, { useEffect, useState } from 'react';
import BidUpdate from './BidUpdate';
import { User } from '@supabase/supabase-js';
import TicketStatusUpdate from './TicketStatusUpdate';
import { rePointTicket, deleteTicket } from './modifyTicket';
import { NameUpdate } from './NameUpdate';
import { NewTicket } from './NewTicket';

const Bidders = ({ loggedInUser: user }: { loggedInUser: User | null }) => {

    useEffect(() => {
        const nIntervId = setInterval(pingFibbers, 30000);
        pingFibbers();
        return () => { clearInterval(nIntervId); }
    }, [])

    const pingFibbers = async () => {
        if (user?.id) {
            await supabase.from("fibbers").update({ updated_at: new Date(Date.now()).toISOString() }).eq('id', user?.id);
        }
    }

    const activeFibber = (lastUpdated: string | null) => (Date.parse(lastUpdated ?? "") > Date.now() - 1000 * 35)

    const [{ data: rtBids, error: bidError }] = useRealtime('fibbers', {
        select: {
            columns: 'id,updated_at,name,bid',
        },
    })
    const me: { id: string, name: string, bid: number } | null = rtBids?.reduce((acc, p) => (p.id === user?.id) ? p : acc, null)
    const fibbersOnline: { id: string, name: string, bid: number }[] | undefined = rtBids?.filter((p) => activeFibber(p.updated_at))

    const [{ data: rtTickets, error: ticketError }] = useRealtime('tickets', {
        select: {
            columns: 'id,desc,bid,status',
        },
    })
    if (!me || !rtBids) return null;
    const unfinishedTickets = rtTickets?.filter((t) => t.status !== 'FIN')
    const finishedTickets = rtTickets?.filter((t) => t.status === 'FIN')
    const biddingTicket: boolean = rtTickets?.filter((t) => (t.status === 'BIDDING')).length === 1
    const debateTicket: boolean = rtTickets?.filter((t) => (t.status === 'DEBATE')).length === 1
    const canDebate = biddingTicket && fibbersOnline?.filter((f) => f.bid === 0).length === 0;

    console.log("fibbersOnline", fibbersOnline)

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
                                    <BidUpdate table={"fibbers"} id={p.id} initBid={p.bid} /></>
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
                                <span className={`badge${p.bid ? 0 : 8}`}>{p.bid ? "#" : "?"}</span> : null
                            }
                            {debateTicket ?
                                <span className={`badge${p.bid ?? 0}`}>{p.bid ?? "😥"}</span> : null
                            }
                        </li>
                    ))}
                </ul>
            <div>
                <ul className="list-group">
                    {
                        unfinishedTickets ? unfinishedTickets.map((t: { id: string, desc: string, bid: number, status: string }) => (
                            <li key={t.id}>{t.id}
                                <span className={`badge${t.bid}`}>{t.bid ? t.bid : "?"}</span>
                                {t.status === 'DEBATE' ? <BidUpdate table={"tickets"} id={t.id} initBid={t.bid} /> : null}
                                <TicketStatusUpdate initStatus={t.status} id={t.id} canDebate={canDebate} />
                            </li>
                        )) : null}
                </ul>
                {user && !biddingTicket && !debateTicket ?
                    <NewTicket initId={"INTEXP-"} user={user} />
                    : <span>-------------</span>}
                <ul className="list-group">
                    {
                        finishedTickets ? finishedTickets.map((t: { id: string, desc: string, bid: number, status: string }) => (
                            <li key={t.id}>{t.id}
                                <span className={`badge${t.bid}`}>{t.bid ? t.bid : "?"}</span>
                                <button disabled={biddingTicket || debateTicket} onClick={() => rePointTicket(t.id)}>re-point</button>
                                <button onClick={() => deleteTicket(t.id)}>X</button>
                            </li>
                        )) : null}
                </ul>
            </div>


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