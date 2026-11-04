// Reference letters are display aliases. Source row IDs remain the lookup and
// persistence keys; illustrative chairs never acquire a reference ticket.
export function referenceRowLabel(venue,seat){
  if(!seat||seat.visualOnly)return null;
  if(seat.referenceSeat)return seat.row;
  const row=venue.researchRenderBatch?.seatNumbering?.rows[seat.section]?.[seat.row];
  return row?.seats.includes(seat.seat)?row.label:null;
}

export function sourceTicketInput(venue,ticket){
  const rows=venue.researchRenderBatch?.seatNumbering?.rows[ticket.section.trim()];
  if(!rows)return ticket;
  const matched=Object.entries(rows).find(([,row])=>row.label===ticket.row.trim().toUpperCase()&&row.seats.includes(ticket.seat.trim()));
  return matched?{section:ticket.section.trim(),row:matched[0],seat:ticket.seat.trim()}:ticket;
}
