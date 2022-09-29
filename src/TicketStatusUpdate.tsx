// TicketStatusUpdate
import React from 'react'
import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function TicketStatusUpdate({ id, initStatus, canDebate }: { id: string, initStatus: string, canDebate: boolean }) {
    const [toast, setToast] = useState<string[]>([]);

    async function handleUpdate(e: any, status: string) {
        e.preventDefault();
        setToast([])
        if (canDebate || status !== 'DEBATE') {
            const { data, error } = await supabase.from('tickets').update({ status }).eq('id', id);
            if (error) alert(error)
        }
        else {
            setToast(["Cannot DEBATE!", "Some Bids are '🤷'", "⏳ Try Again 😊"])
            e.target.value = "BIDDING";
        }
    }

    return (
        <form
            className="form-widget">
            <select defaultValue={initStatus}
                onChange={(e) => handleUpdate(e, e.target.value ?? 'BIDDING')}
            >
                <option value={'BIDDING'} key="0" >BIDDING</option>
                <option value={'DEBATE'} key="1" >DEBATE</option>
                <option value={'FIN'} key="2" >FIN</option>
            </select>
            {toast.length !== 0 ?
                <div>
                <span className="badge5" >{toast[0]}</span><br/>
                <span className="badge8" >{toast[1]}</span><br/>
                <span className="badge13" >{toast[2]}</span>
                </div>
                : null
            }
        </form>
    );
}
