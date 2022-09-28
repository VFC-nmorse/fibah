import { supabase } from "./supabaseClient";

export const redebateTicket = async (id: string) => {
    const { data, error } = await supabase.from('tickets').update({ status: 'DEBATE' }).eq('id', id);
}

export const deleteTicket = async (id: string) => {
    const { data, error } = await supabase.from('tickets').delete().match({ id });
}
