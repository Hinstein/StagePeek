export function resolveInitialRoute(params, catalog) {
  const requestedVenue = params.get('venue');
  const requestedSection = params.get('section');
  const requestedRow = params.get('row');
  const requestedSeat = params.get('seat');
  const requestedLayout = params.get('layout');
  const venue = requestedVenue && catalog.some(item => item.id === requestedVenue)
    ? requestedVenue
    : 'tottenham';
  return {
    venueId: venue,
    section: requestedSection || '',
    row: requestedRow || '',
    seat: requestedSeat || '',
    layout: /^[a-z0-9-]{1,40}$/.test(requestedLayout||'') ? requestedLayout : 'end'
  };
}
