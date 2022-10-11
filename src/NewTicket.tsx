import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export const NewTicket = ({ initId, user }: { initId: string, user: User }) => {
    const [tid, setId] = useState(initId);
    async function updateId(e: any) {
        e.preventDefault();
        const { error } = await supabase.from('tickets').insert({ id: tid });
        if (error) alert(error.message)
        // reset all bids on newTicket
        const { error: resetError } = await supabase.from('fibbers').update({ bid: 0 }).eq('id', id);
        if (resetError) alert(resetError.message)
    }

    return (<form onSubmit={updateId} className="form-widget" id="update-profile">
        <span>
            <input
                id="id"
                type="text"
                value={tid || ''}
                onChange={(e) => setId(e.target.value)}
            />
        </span>
        <span>
            <button className="button primary block" type="submit" >
                New Ticket
            </button>
        </span>
    </form>);
}