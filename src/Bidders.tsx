import { useRealtime, useUpdate } from 'react-supabase'
import { supabase } from './supabaseClient'
import React, { useState } from 'react';
import BidUpdate from './BidUpdate';
import { User } from '@supabase/supabase-js';
import TicketStatusUpdate from './TicketStatusUpdate';
import { debateTicket } from './debateTicket';
import { NameUpdate } from './NameUpdate';
import { NewTicket } from './NewTicket';

const Bidders = ({ loggedInUser: user }: { loggedInUser: User | null }) => {

    const [{ data: rtBids, error: bidError }] = useRealtime('fibbers', {
        select: {
            columns: 'id,name,bid',
        },
    })
    const person: { id: string, name: string, bid: number } | null = rtBids?.filter((p) => (p.id === user?.id))[0]
    console.log("person", person)
    const [{ data: rtTickets, error: ticketError }] = useRealtime('tickets', {
        select: {
            columns: 'id,desc,bid,status',
        },
    })
    if (!person) return null;
    const unfinishedTickets = rtTickets?.filter((t)=>t.status !== 'FIN')
    const finishedTickets = rtTickets?.filter((t)=>t.status === 'FIN')

    return (
        <div className="container">
            <div>
                <ul className="list-group">
                    {
                        rtBids ? rtBids.map((p: { id: string, name: string, bid: number }) => (
                            <li key={p.id}>{p.name}
                                {
                                    user?.id === p.id ?
                                        <>
                                            <span className="badge">{p.bid ? p.bid : "?"}</span>
                                            <BidUpdate table={"fibbers"} id={p.id} initBid={p.bid} />
                                        </> :
                                        <span className="badge">{p.bid ? p.bid : "?"}</span>
                                }
                            </li>
                        )) : null}
                </ul>
            </div>

            <div>
            <ul className="list-group">
                    {
                        unfinishedTickets ? unfinishedTickets.map((t: { id: string, desc: string, bid: number, status: string }) => (
                            <li key={t.id}>{t.id} 
                                 {
                                    t.status === 'DEBATE' || t.status === 'BIDDING' ?
                                        <>
                                            {t.desc}
                                            <span className="badge">{t.bid ? t.bid : "?"}</span>
                                            {t.status === 'DEBATE' ? <BidUpdate table={"tickets"} id={t.id} initBid={t.bid} /> : null}
                                            <TicketStatusUpdate initStatus={t.status} id={t.id} />
                                        </> :
                                        <>
                                        <button onClick={()=>debateTicket(t.id)}>redebate</button>
                                        <span className="badge">{t.bid ? t.bid : "?"}</span>
                                        
                                        </>
                                    }
                                    
                                
                            </li>
                        )) : null}
                </ul>
                { user ?
                <NewTicket initId={"INTEXP-"} user={user}/>
                : null }
                <ul className="list-group">
                    {
                        finishedTickets ? finishedTickets.map((t: { id: string, desc: string, bid: number, status: string }) => (
                            <li key={t.id}>{t.id} 
                                 {
                                    t.status === 'DEBATE' || t.status === 'BIDDING' ?
                                        <>
                                            {t.desc}
                                            <span className="badge">{t.bid ? t.bid : "?"}</span>
                                            {t.status === 'DEBATE' ? <BidUpdate table={"tickets"} id={t.id} initBid={t.bid} /> : null}
                                            <TicketStatusUpdate initStatus={t.status} id={t.id} />
                                        </> :
                                        <>
                                        <button onClick={()=>debateTicket(t.id)}>redebate</button>
                                        <span className="badge">{t.bid ? t.bid : "?"}</span>
                                        
                                        </>
                                    }
                                    
                                
                            </li>
                        )) : null}
                </ul>
            </div>


            <div>
            { user ?
                <NameUpdate initName={person?.name ?? user?.email?.split('@')[0] ?? "blah" } user={user} />
                : null
            }
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