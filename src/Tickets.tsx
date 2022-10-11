import React from "react"
import TicketStatusUpdate from './TicketStatusUpdate';
import { rePointTicket, deleteTicket } from './modifyTicket';
import { NewTicket } from './NewTicket';
import { bidToEmoji } from "./bidUtils";
import { BidUpdate } from "./BidUpdate";
import { User } from "@supabase/supabase-js";

export const Tickets = ({ rtTickets, user, biddingTicket, debateTicket, canDebate, keepAlive }: { rtTickets: { id: string, desc: string, bid: number, status: string }[] | null | undefined, user: User | null, biddingTicket: boolean, debateTicket: boolean, canDebate: boolean, keepAlive: () => void }) => {
    const unfinishedTickets = rtTickets?.filter((t) => t.status !== 'FIN')
    const finishedTickets = rtTickets?.filter((t) => t.status === 'FIN')
    return <div>
        <ul className="list-group">
            {
                unfinishedTickets ? unfinishedTickets.map((t: { id: string, desc: string, bid: number, status: string }) => (
                    <li key={t.id}>{t.id}
                        <span className={`badge${t.bid}`}>{bidToEmoji(t.bid)}</span>
                        {t.status === 'DEBATE' ? <BidUpdate table={"tickets"} id={t.id} initBid={t.bid} disabled={false} keepAlive={keepAlive} /> : null}
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
                        <span className={`badge${t.bid}`}>{bidToEmoji(t.bid)}</span>
                        <button disabled={biddingTicket || debateTicket} onClick={() => rePointTicket(t.id)}>re-point</button>
                        <button onClick={() => deleteTicket(t.id)}>X</button>
                    </li>
                )) : null}
        </ul>
    </div>
}
