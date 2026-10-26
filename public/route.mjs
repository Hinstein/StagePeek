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
