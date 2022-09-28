import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export const NameUpdate = ({initName, user}: {initName: string, user: User}) => {
    const [name, setName] = useState(initName);
    const [toast, setToast] = useState("");
    const id = user.id
    async function updateName(e: any) {
        e.preventDefault();
        const { data, error } = await supabase.from('fibbers').update({ name }).eq('id', id);
        if (error) {
            setToast(error.message);
        }
        else {
            setToast("");
        }
    }

    return (<form onSubmit={updateName} className="form-widget" id="update-profile">
        <span className="badge-person2">{name}</span>
        <div>{user.email}</div>
        <div>
            <label htmlFor="name"></label>
            <input
                id="name"
                type="text"
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
            />
        </div>
        <span className="badge8" >{toast}</span>
        <div>
            <button className="button primary block" type="submit" >
                Update My Profile
            </button>
        </div>
    </form>);
}