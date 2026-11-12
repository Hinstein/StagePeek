import {writeFileSync} from 'node:fs';
import {createPublicSite} from '../server/public-pages.mjs';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {releasedVenues} from '../server/concert-views/release.mjs';
// The HTTP sitemap uses this same registry. Keep the static deployment copy in sync.
writeFileSync(new URL('../public/sitemap.xml',import.meta.url),createPublicSite(releasedVenues(loadConcertViews({localDrafts:true}))).sitemap());
