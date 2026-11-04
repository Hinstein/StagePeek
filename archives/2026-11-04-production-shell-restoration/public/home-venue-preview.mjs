import {mountVenuePreview} from './venue-preview.mjs';
import {copy} from './locales.mjs';
export function mountKaiTakPreview(root){return mountVenuePreview(root,{url:'/api/venues/kai-tak-stadium',overviewLabel:copy('启德 · 看台总览')});}
