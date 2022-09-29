import { supabase } from "./supabaseClient";

export const rePointTicket = async (id: string) => {
    const { data, error } = await supabase.from('tickets').update({ status: 'BIDDING' }).eq('id', id);
}

export const deleteTicket = async (id: string) => {
    const { data, error } = await supabase.from('tickets').delete().match({ id });
}
