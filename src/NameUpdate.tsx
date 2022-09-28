import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export const NameUpdate = ({initName, user}: {initName: string, user: User}) => {
    const [name, setName] = useState(initName);
    const id = user.id
    async function updateName(e: any) {
        e.preventDefault();
        // setLoading(true);
        console.log("handle Update (name, id)", name, id);
        const { data, error } = await supabase.from('fibbers').update({ name }).eq('id', id);
        console.log("handled Update (name, data, error)", name, data, error);
        // setLoading(false);
    }

    return (<form onSubmit={updateName} className="form-widget" id="update-profile">
        <div>Email: {user.email}</div>
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
                Profile Name
            </button>
        </div>
    </form>);
}