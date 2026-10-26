import {writeFileSync} from 'node:fs';
import {createPublicSite} from '../server/public-pages.mjs';
import {loadVenues} from '../server/venues.mjs';
// The HTTP sitemap uses this same registry. Keep the static deployment copy in sync.
writeFileSync(new URL('../public/sitemap.xml',import.meta.url),createPublicSite(loadVenues()).sitemap());
