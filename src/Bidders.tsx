import { useRealtime, useUpdate } from 'react-supabase'
import { supabase } from './supabaseClient'
import React, { useState } from 'react';
import BidUpdate from './BidUpdate';
import { User } from '@supabase/supabase-js';
import TicketStatusUpdate from './TicketStatusUpdate';
import { redebateTicket, deleteTicket } from './redebateTicket';
import { NameUpdate } from './NameUpdate';
import { NewTicket } from './NewTicket';

const Bidders = ({ loggedInUser: user }: { loggedInUser: User | null }) => {

    const [{ data: rtBids, error: bidError }] = useRealtime('fibbers', {
        select: {
            columns: 'id,name,bid',
        },
    })
    const person: { id: string, name: string, bid: number } | null = rtBids?.reduce((acc, p) => (p.id === user?.id) ? p : acc, null)

    const [{ data: rtTickets, error: ticketError }] = useRealtime('tickets', {
        select: {
            columns: 'id,desc,bid,status',
        },
    })
    if (!person || !rtBids) return null;
    const unfinishedTickets = rtTickets?.filter((t) => t.status !== 'FIN')
    const finishedTickets = rtTickets?.filter((t) => t.status === 'FIN')
    const biddingTicket: boolean = rtTickets?.filter((t) => (t.status === 'BIDDING')).length === 1
    const debateTicket: boolean = rtTickets?.filter((t) => (t.status === 'DEBATE')).length === 1

    return (
        <div className="container">
            <div>
                <ul className="list-group">
                    {
                        rtBids ? rtBids.map((p: { id: string, name: string, bid: number }) => (
                            <li key={p.id}>
                                {
                                    user?.id === p.id ? <>
                                        <span className="badge-person1">{p.name}</span>
                                        <BidUpdate table={"fibbers"} id={p.id} initBid={p.bid} /></>
                                        : <span className="badge-person2">{p.name}</span>

                                }
                            </li>
                        )) : null}
                </ul>
            </div>
            <div>
                <ul className="list-group slim">{
                    rtBids.map((p: { id: string, name: string, bid: number }) => (
                        <li key={p.id}>
                            {biddingTicket ?
                                <span className="badge0">{p.bid ? "#" : "?"}</span> : null
                            }
                            {debateTicket ?
                                <span className={`badge${p.bid}`}>{p.bid}</span> : null
                            }
                        </li>
                    ))}
                </ul></div>
            <div>
                <ul className="list-group">
                    {
                        unfinishedTickets ? unfinishedTickets.map((t: { id: string, desc: string, bid: number, status: string }) => (
                            <li key={t.id}>{t.id}
                                <span className={`badge${t.bid}`}>{t.bid ? t.bid : "?"}</span>
                                {t.status === 'DEBATE' ? <BidUpdate table={"tickets"} id={t.id} initBid={t.bid} /> : null}
                                <TicketStatusUpdate initStatus={t.status} id={t.id} />
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
                                <button disabled={biddingTicket || debateTicket} onClick={() => redebateTicket(t.id)}>redebate</button>
                                <button onClick={() => deleteTicket(t.id)}>X</button>
                            </li>
                        )) : null}
                </ul>
            </div>


            <div>
                {user ?
                    <NameUpdate initName={person?.name ?? user?.email?.split('@')[0] ?? "blah"} user={user} />
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