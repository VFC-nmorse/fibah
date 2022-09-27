import React from 'react';
import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function BidUpdate({ id, initBid }: { id:string, initBid:number }) {
  const [loading, setLoading] = useState(false);
  const [bid, setBid] = useState(initBid);

  async function handleUpdate(e:any) {
      e.preventDefault();
    setLoading(true);
    console.log("handle Update (bid, id)", bid, id);
    const { data, error } = await supabase.from('fibbers').update({bid}).eq('id', id);
    console.log("handled Update (bid, data, error)", bid, data, error);
    setLoading(false);
  }

  return (
    <form
    onSubmit={handleUpdate}
    className="form-widget">
    <select defaultValue={bid || 0}
        onChange={(e) => setBid(parseInt(e.target.value, 10) ?? 0)}
    >
        <option value={0} key="0" >?</option>
        <option value={1} key="1" >1</option>
        <option value={2} key="2" >2</option>
        <option value={3} key="3" >3</option>
        <option value={5} key="5" >5</option>
        <option value={8} key="8" >8</option>
        <option value={13} key="13" >13</option>
    </select>
    <button disabled={loading} className="button primary block" >
        Send My Bid
    </button>
</form>
    );
}