export function resolveInitialRoute(params, catalog) {
  const requestedVenue = params.get('venue');
  const requestedSection = params.get('section');
  const requestedRow = params.get('row');
  const requestedSeat = params.get('seat');
  const requestedLayout = params.get('layout');
  const available=catalog.filter(item=>!item.locked);
  const preferred=['taipei-arena','hong-kong-coliseum','kai-tak-stadium'].map(id=>available.find(item=>item.id===id&&item.sourceSeatCount>0)).find(Boolean);
  const fallback=preferred||available.find(item=>item.sourceSeatCount>0)||available.find(item=>item.id==='tottenham')||available[0]||catalog[0];
  const venue = requestedVenue && catalog.some(item => item.id === requestedVenue)
    ? requestedVenue
    : fallback?.id||'tottenham';
  return {
    venueId: venue,
    section: requestedSection || '',
    row: requestedRow || '',
    seat: requestedSeat || '',
    layout: /^[a-z0-9-]{1,40}$/.test(requestedLayout||'') ? requestedLayout : 'end'
  };
}

// Ticket labels are literal identities: keep zeroes, prefixes and shared-bank aliases.
export function resolveDraftRoute(params, map) {
  const ticketLabel=(params.get('section')||'').trim(),row=(params.get('row')||'').trim(),seat=(params.get('seat')||'').trim();
  const invalid=[ticketLabel,row,seat].some(value=>value.length>40);
  const section=invalid?null:map.sections.find(section=>(section.ticketLabels||[section.ticketLabel]).includes(ticketLabel));
  return {sectionId:section?.id||'',ticketLabel:invalid?'':ticketLabel,row:invalid?'':row,seat:invalid?'':seat,invalid,
    view:['3d','fixed','event'].includes(params.get('preview'))?params.get('preview'):'3d'};
}
