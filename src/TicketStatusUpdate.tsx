// TicketStatusUpdate
import React from 'react'
import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function TicketStatusUpdate({ id, initStatus }: { id: string, initStatus: string }) {
    const [loading, setLoading] = useState(false);

    async function handleUpdate(e: any, status: string) {
        e.preventDefault();
        setLoading(true);
        console.log("handle Update (status, id)", status, id);
        const { data, error } = await supabase.from('tickets').update({ status }).eq('id', id);
        console.log("handled Update (status, data, error)", status, data, error);
        setLoading(false);
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
        </form>
    );
}
