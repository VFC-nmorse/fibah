import React from 'react';
import { useState } from 'react';
import { bidToEmoji } from './bidUtils';
import { supabase } from './supabaseClient';

export const BidUpdate = ({ id, initBid, table, disabled }: { id: string, initBid: number, table: string, disabled: boolean }) => {

  async function handleUpdate(e: any, bid: number) {
    e.preventDefault();
    const { data, error } = await supabase.from(table).update({ bid }).eq('id', id);
    if (error) alert(error.message)
  }

  return (
    <form
      className="form-widget">
      <select
        disabled={disabled}
        defaultValue={initBid || 0}
        onChange={(e) => handleUpdate(e, parseInt(e.target.value, 10) ?? 0)}
      >
        <option value={0} key="0" >{bidToEmoji(0)}</option>
        <option value={-2} key="-2" >{bidToEmoji(-2)}</option>
        <option value={1} key="1" >1</option>
        <option value={2} key="2" >2</option>
        <option value={3} key="3" >3</option>
        <option value={5} key="5" >5</option>
        <option value={8} key="8" >8</option>
        <option value={13} key="13" >13</option>
        <option value={-3} key="-3" >{bidToEmoji(-3)}</option>
        <option value={-4} key="-4" >{bidToEmoji(-4)}</option>
        <option value={-5} key="-5" >{bidToEmoji(-5)}</option>
      </select>
    </form>
  );
}