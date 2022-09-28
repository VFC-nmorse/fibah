import { supabase } from "./supabaseClient";

export const debateTicket = async (id: string) => {
    const { data, error } = await supabase.from('tickets').update({ status: 'DEBATE' }).eq('id', id);
}