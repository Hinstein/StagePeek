import {displaySectionLabel} from './geometry.mjs';

// Reference letters are display aliases. Source row IDs remain the lookup and
// persistence keys; illustrative chairs never acquire a reference ticket.
export function referenceRowLabel(venue,seat){
  if(!seat||seat.visualOnly)return null;
  if(seat.referenceSeat)return seat.row;
  const row=venue.researchRenderBatch?.seatNumbering?.rows[seat.section]?.[seat.row];
  return row?.seats.includes(seat.seat)?row.label:null;
}

export function sourceTicketInput(venue,ticket){
  const preview=!venue.sourceSeats&&venue.sections.find(section=>sectionInputLabel(venue,section)===ticket.section.trim());
  if(preview)return {...ticket,section:preview.ticketLabels[0]||preview.id};
  const rows=venue.researchRenderBatch?.seatNumbering?.rows[ticket.section.trim()];
  if(!rows)return ticket;
  const matched=Object.entries(rows).find(([,row])=>row.label===ticket.row.trim().toUpperCase()&&row.seats.includes(ticket.seat.trim()));
  return matched?{section:ticket.section.trim(),row:matched[0],seat:ticket.seat.trim()}:ticket;
}
// Generated bank IDs are route keys, not labels printed on a ticket.
export function sectionInputLabel(venue,section){
  return !venue.sourceSeats&&/^base-(lower|upper)-\d+$/i.test(section.id)&&section.ticketLabels[0]===section.id?displaySectionLabel(section):section.ticketLabels[0]||section.id;
}
