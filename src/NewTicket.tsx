import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export const NewTicket = ({initId, user}: {initId: string, user: User}) => {
    const [tid, setId] = useState(initId);
    async function updateId(e: any) {
        e.preventDefault();
        // setLoading(true);
        console.log("handle Update (tid)", tid);
        const { data, error } = await supabase.from('tickets').insert({ id: tid });
        console.log("handled Update (id, data, error)", tid, data, error);
        if (error) alert(error.message)
        // setLoading(false);
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